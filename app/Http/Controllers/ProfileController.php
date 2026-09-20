<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;
use App\Services\ImageKitService;

class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response
    {
        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
            'user' => $request->user(),
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(
        ProfileUpdateRequest $request,
        ImageKitService $imageKit
    ): RedirectResponse {
        $validated = $request->validated();

        $user = $request->user();

        if ($request->hasFile('profile_photo')) {

            // ارفع الصورة الجديدة
            $photo = $request->file('profile_photo');

            $fileName = 'student_' . $user->id . '_' . time();

            $result = $imageKit->upload(
                $photo,
                $fileName,
                'students/' . $user->id
            );

            // احذف الصورة القديمة من ImageKit
            if ($user->profile_photo_file_id) {
                try {
                    $imageKit->delete($user->profile_photo_file_id);
                } catch (\Throwable $e) {
                    // منمنعش تحديث البروفايل لو فشل حذف الصورة القديمة
                }
            }

            // خزّن بيانات الصورة الجديدة
            $validated['profile_photo_url'] = $result->result->url;
            $validated['profile_photo_file_id'] = $result->result->fileId;
        }

        unset($validated['profile_photo']);

        $user->fill($validated);

        if ($user->isDirty('email')) {
            $user->email_verified_at = null;
        }

        $user->save();

        return Redirect::route('profile.edit')
            ->with('status', 'profile-updated');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }
}