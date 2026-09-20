<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Course;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class EnrollmentController extends Controller
{
    public function index()
    {
        $orders = Order::where('user_id', auth()->id())->latest()->get();

        return Inertia::render('Courses/Myorders', [
            'orders' => $orders,
        ]);
    }

    public function create()
    {
        return Inertia::render('Courses/Checkout');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'course_id' => 'required|exists:courses,id',
        ]);

        $course = Course::findOrFail($validated['course_id']);

        $order = Order::create([
            'user_id'      => auth()->id(),
            'course_id'    => $course->id,
            'product_name' => $course->name, 
            'price'        => $course->price, 
        ]);

        return redirect()->route('order.pay', $order->id);
    }

    public function initiatePayment($id)
    {
        $order = Order::where('user_id', auth()->id())
            ->findOrFail($id);

        if ($order->payment_status === 'Completed') {
            return redirect()
                ->route('courses.index')
                ->with('status', 'This order has already been paid.');
        }

        $merchantId = config('services.kashier.mid');
        $mode       = config('services.kashier.mode', 'test');
        $secret     = config('services.kashier.api_key');
        $currency   = 'EGP';

        $amount = number_format(
            (float) $order->price,
            2,
            '.',
            ''
        );

        $path = "/?payment={$merchantId}.{$order->id}.{$amount}.{$currency}";

        $hash = hash_hmac('sha256', $path, $secret, false);

        $queryParams = [
            'merchantId'       => $merchantId,
            'mode'             => $mode,
            'orderId'          => (string) $order->id,
            'amount'           => $amount,
            'currency'         => $currency,
            'hash'             => $hash,
            'allowedMethods'   => 'card,wallet,bank_installments',
            'merchantRedirect' => route('order.callback'),
            'failureRedirect'  => route('order.failure'),
            'redirectMethod'   => 'get',
            'brandColor'       => '#00bcbc',
            'display'          => 'ar',
        ];

        $paymentUrl = 'https://checkout.kashier.io/?' . http_build_query($queryParams);

        Log::info('Kashier payment URL generated', [
            'order_id'    => $order->id,
            'amount'      => $amount,
            'currency'    => $currency,
            'mode'        => $mode,
            'merchant_id' => $merchantId,
        ]);

        return Inertia::location($paymentUrl);
    }

    public function failure()
    {
        return redirect()->route('courses.index')
            ->with('status', 'Payment was not completed. Please try again.');
    }

    public function handleCallback(Request $request)
    {
        $secret = config('services.kashier.api_key');

        Log::info('Callback hit with parameters: ', $request->all());

        $queryString = "";
        foreach ($request->query() as $key => $value) {
            if ($key === "signature" || $key === "mode") {
                continue;
            }
            $queryString .= "&{$key}={$value}";
        }

        $queryString = ltrim($queryString, "&");
        $calculatedSignature = hash_hmac('sha256', $queryString, $secret, false);
        $providedSignature = (string)$request->query("signature");

        if ($providedSignature !== '' && hash_equals($calculatedSignature, $providedSignature)) {
            
            $paymentStatus = $request->query('paymentStatus');
            $orderId       = $request->query('merchantOrderId');
            $transactionId = $request->query('transactionId');

            $order = Order::findOrFail($orderId);

            if ($paymentStatus === 'SUCCESS') {
                if ($order->payment_status !== 'Completed') {
                    // تحديث حالة الطلب
                    $order->update([
                        'payment_transaction_id' => $transactionId,
                        'payment_method'         => 'online-payment',
                        'payment_status'         => 'Completed',
                    ]);

                    // ربط الصف بالطالب بشكل مباشر ونظيف 
                    $course = Course::find($order->course_id);
                    if ($course) {
                        $course->users()->syncWithoutDetaching([$order->user_id]);
                        
                        return redirect()
                            ->route('courses.learn', $course->id)
                            ->with('status', 'Payment done successfully and course unlocked!');
                    }
                } else {
                    // في حالة إن الطلب مدفوع من قبل والـ Callback وصل متأخر أو مكرر
                    return redirect()
                        ->route('courses.learn', $order->course_id)
                        ->with('status', 'Payment done successfully and course unlocked!');
                }

                return redirect()->route('courses.index')->with('status', 'Payment done successfully');

            } elseif ($paymentStatus === 'CANCELLED') {
                $order->update([
                    'payment_transaction_id' => $transactionId,
                    'payment_method'         => 'online-payment',
                    'payment_status'         => 'Cancelled'
                ]);

                return redirect()->route('courses.index')->with('status', 'Payment cancelled. Please try again.');

            } else {
                // Failed Status
                $order->update([
                    'payment_transaction_id' => $transactionId,
                    'payment_method'         => 'online-payment',
                    'payment_status'         => 'Failed'
                ]);

                return redirect()->route('courses.index')->with('status', 'Payment failed. Please try again.');
            }
        }

        // توثيق الـ signature الخاطئ للتبين
        Log::error('Invalid signature: ', [
            'received'    => $providedSignature,
            'calculated'  => $calculatedSignature,
            'queryString' => $queryString
        ]);

        return redirect()->route('courses.index')->with('status', 'Invalid signature. Please try again.');
    }
}