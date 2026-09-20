// Login.jsx
import Checkbox from '@/Components/Checkbox';
import Divider from '@/Components/divider';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useEffect } from 'react';
import Swal from 'sweetalert2';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    // رسالة الحالة (زي "تم إرسال رابط استعادة كلمة المرور") بتتعرض في toast
    useEffect(() => {
        if (!status) return;

        Swal.fire({
            toast: true,
            position: 'top-start',
            icon: 'success',
            title: status,
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
        });
    }, [status]);

    // أخطاء السيرفر (إيميل/باسورد غلط وغيرها) بتتعرض في SweetAlert
    useEffect(() => {
        const messages = Object.values(errors);

        if (messages.length === 0) {
            return;
        }

        Swal.fire({
            icon: 'error',
            title: 'خطأ',
            html: messages
                .map((msg) => `<div class="text-right">${msg}</div>`)
                .join(''),
            confirmButtonText: 'حسنًا',
            confirmButtonColor: '#c9a227',
        });
    }, [errors]);

    const submit = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="تسجيل الدخول" />

            <div className="mb-11">
                <h1 className="text-3xl font-bold text-primary dark:text-white">
                    تسجيل الدخول
                </h1>
                <p className="mt-2.5 text-base text-primary/50 dark:text-white/50">
                    أهلاً بيك تاني، سجّل دخولك عشان تكمل رحلتك التعليمية.
                </p>
            </div>

            <form onSubmit={submit}>
                <div>
                    <InputLabel
                        htmlFor="email"
                        value="البريد الإلكتروني"
                        className="text-base font-semibold"
                    />

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-2.5 block w-full rounded border-2 border-primary/15 bg-offwhite/60 px-5 py-3.5 text-base font-semibold text-primary placeholder:font-normal focus:border-gold focus:ring-gold/30 dark:border-white/10 dark:bg-white/5 dark:text-white"
                        autoComplete="username"
                        isFocused={true}
                        onChange={(e) => setData('email', e.target.value)}
                    />
                </div>

                <div className="mt-6">
                    <InputLabel
                        htmlFor="password"
                        value="كلمة المرور"
                        className="text-base font-semibold"
                    />

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-2.5 block w-full rounded border-2 border-primary/15 bg-offwhite/60 px-5 py-3.5 text-base font-semibold text-primary placeholder:font-normal focus:border-gold focus:ring-gold/30 dark:border-white/10 dark:bg-white/5 dark:text-white"
                        autoComplete="current-password"
                        onChange={(e) => setData('password', e.target.value)}
                    />
                </div>

                <div className="mt-6 block">
                    <label className="flex cursor-pointer items-center gap-3">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            onChange={(e) =>
                                setData('remember', e.target.checked)
                            }
                            className="h-5 w-5 rounded border-2 border-primary/20 text-gold focus:ring-gold/40"
                        />
                        <span className="text-base text-primary/60 dark:text-white/60">
                            تذكرني
                        </span>
                    </label>
                </div>

                <div className="mt-10">
                    <PrimaryButton
                        disabled={processing}
                        type="submit"
                        className="py-4 text-lg"
                    >
                        تسجيل الدخول
                    </PrimaryButton>
                </div>
                <Divider>أو</Divider>
                <div className="text-center">
                    <Link href={route('register')} className="rounded text-sm text-primary/55 underline decoration-primary/20 underline-offset-2 hover:text-primary focus:outline-none focus:ring-2 focus:ring-gold/40 focus:ring-offset-2 dark:text-white/50 dark:hover:text-white dark:focus:ring-offset-gray-900">
                        ليس لديك حساب؟ سجل الآن
                    </Link>
                </div>
            </form>
        </GuestLayout>
    );
}