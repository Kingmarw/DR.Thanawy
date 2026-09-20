<?php

namespace App\Policies;

use App\Models\User;

class FilamentUserPolicy
{
    /**
     * Determine if the user can access the admin panel.
     */
    public function access(User $user): bool
    {
        // الشرط الأساسي: المستخدم لازم يكون مسجل دخول وقيمة is_admin = true
        return $user->is_admin === true;
    }
}