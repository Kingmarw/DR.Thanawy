import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Checkout() {
    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight">إتمام الشراء</h2>}
        >
            <Head title="إتمام الشراء" />

            <div className="py-16">
                <div className="max-w-lg mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="bg-gray-900 border border-white/10 rounded-2xl p-8 shadow-xl">
                        <p className="text-gray-300">
                            لإتمام الاشتراك في كورس، ادخل على صفحة الصف واضغط على زرار
                            "اشتراك في الصف الآن" وهيتم تحويلك لصفحة الدفع مباشرة.
                        </p>
                        <Link
                            href={route('courses.index')}
                            className="inline-block mt-6 px-5 py-2.5 rounded-xl bg-[var(--gold,#f59e0b)] text-gray-950 font-bold hover:opacity-90 transition"
                        >
                            تصفح الصفوف
                        </Link>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}