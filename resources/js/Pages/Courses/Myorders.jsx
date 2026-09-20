import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

const statusStyles = {
    Completed: 'bg-emerald-600/10 text-emerald-400 border-emerald-600/30',
    Pending: 'bg-yellow-600/10 text-yellow-400 border-yellow-600/30',
    Cancelled: 'bg-gray-600/10 text-gray-400 border-gray-600/30',
    Failed: 'bg-red-600/10 text-red-400 border-red-600/30',
};

const statusLabels = {
    Completed: 'مكتمل',
    Pending: 'قيد الانتظار',
    Cancelled: 'ملغي',
    Failed: 'فشل',
};

export default function MyOrders({ orders }) {
    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight">طلباتي</h2>}
        >
            <Head title="طلباتي" />

            <div className="py-10">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {orders.length > 0 ? (
                        <div className="bg-gray-900 border border-white/10 rounded-2xl overflow-hidden shadow-xl">
                            <table className="w-full text-sm text-right">
                                <thead className="bg-gray-950/60 text-gray-400">
                                    <tr>
                                        <th className="px-5 py-3 font-medium">الصف</th>
                                        <th className="px-5 py-3 font-medium">السعر</th>
                                        <th className="px-5 py-3 font-medium">الحالة</th>
                                        <th className="px-5 py-3 font-medium">التاريخ</th>
                                        <th className="px-5 py-3 font-medium"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {orders.map((order) => (
                                        <tr key={order.id} className="text-gray-200">
                                            <td className="px-5 py-4">{order.product_name}</td>
                                            <td className="px-5 py-4">{order.price} ج.م</td>
                                            <td className="px-5 py-4">
                                                <span className={`px-2.5 py-1 rounded-full text-xs border ${statusStyles[order.payment_status] ?? statusStyles.Pending}`}>
                                                    {statusLabels[order.payment_status] ?? order.payment_status}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4 text-gray-500">
                                                {new Date(order.created_at).toLocaleDateString('ar-EG')}
                                            </td>
                                            <td className="px-5 py-4">
                                                {order.payment_status === 'Pending' && (
                                                    <Link
                                                        href={route('order.pay', order.id)}
                                                        className="text-[var(--gold,#f59e0b)] hover:underline"
                                                    >
                                                        إكمال الدفع
                                                    </Link>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-center py-16 text-gray-500 bg-gray-900 border border-white/10 rounded-2xl">
                            مفيش طلبات لسه.
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}