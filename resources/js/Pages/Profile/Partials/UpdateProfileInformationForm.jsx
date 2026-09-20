import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Listbox, Transition } from '@headlessui/react';
import { Link, useForm, usePage } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import Swal from 'sweetalert2';
import { Camera, ChevronDown, Loader2, User as UserIcon } from 'lucide-react';

const grades = [
    { value: 'first_secondary', label: 'الصف الأول الثانوي' },
    { value: 'second_secondary_science', label: 'الصف الثاني علمي' },
    { value: 'second_secondary_arts', label: 'الصف الثاني أدبي' },
    { value: 'third_secondary_science', label: 'الصف الثالث علمي' },
    { value: 'third_secondary_arts', label: 'الصف الثالث أدبي' },
];

const madhabs = [
    { value: 'hanafi', label: 'حنفي' },
    { value: 'shafii', label: 'شافعي' },
    { value: 'maliki', label: 'مالكي' },
    { value: 'hanbali', label: 'حنبلي' },
];

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className = '',
}) {
    const user = usePage().props.auth.user;

    const { data, setData, post, errors, processing } = useForm({
        _method: 'patch',
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        grade: user.grade || '',
        madhab: user.madhab || '',
        profile_photo: null,
    });

    // معاينة وتحميل الصورة الشخصية
    const [photoPreview, setPhotoPreview] = useState(null);
    const [photoLoading, setPhotoLoading] = useState(false);
    const [photoFailed, setPhotoFailed] = useState(false);
    const fileInputRef = useRef(null);

    // الصورة المعروضة: معاينة جديدة اخترها المستخدم، وإلا الصورة الحالية المحفوظة، وإلا أيقونة افتراضية
    const displayedPhoto = photoPreview || user.profile_photo_url || null;

    // لو الرابط اتغير (اخترت صورة جديدة أو اتحفظت) جرّب تحمّلها تاني
    useEffect(() => {
        setPhotoFailed(false);
    }, [displayedPhoto]);

    const handlePhotoSelect = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setData('profile_photo', file);

        const reader = new FileReader();
        reader.onload = (ev) => {
            setPhotoLoading(true); // هيفضل true لحد ما الـ <img> نفسها تخلص تحميل
            setPhotoPreview(ev.target.result);
        };
        reader.readAsDataURL(file);
    };

    // أخطاء السيرفر بتتعرض في SweetAlert
    useEffect(() => {
        const messages = Object.values(errors);

        if (messages.length === 0) {
            return;
        }

        Swal.fire({
            icon: 'error',
            title: 'في مشكلة في البيانات',
            html: messages
                .map((msg) => `<div class="text-right">${msg}</div>`)
                .join(''),
            confirmButtonText: 'حسنًا',
            confirmButtonColor: '#4f46e5',
        });
    }, [errors]);

    const submit = (e) => {
        e.preventDefault();

        // لازم POST مع _method: 'patch' مش patch() مباشرة، لأن PATCH
        // مع multipart/form-data (لما فيه صورة) بيوصل فاضي في PHP
        post(route('profile.update'), {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                setData('profile_photo', null);
                setPhotoPreview(null);

                Swal.fire({
                    toast: true,
                    position: 'top-start',
                    icon: 'success',
                    title: 'تم حفظ بياناتك بنجاح',
                    showConfirmButton: false,
                    timer: 2200,
                    timerProgressBar: true,
                });
            },
            onError: () => {
                // الأخطاء بتتعرض من الـ useEffect بتاع errors فوق،
                // بس نضيف تنبيه سريع كمان لو الطلب فشل تمامًا
            },
        });
    };

    const showPhoto = displayedPhoto && !photoFailed;

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    معلومات الملف الشخصي
                </h2>

                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    قم بتحديث معلومات حسابك الشخصي وعنوان البريد الإلكتروني.
                </p>
            </header>

            <form onSubmit={submit} className="mt-6 space-y-6">
                <div>
                    <InputLabel value="الصورة الشخصية" />

                    <div className="mt-2 flex items-center gap-5">
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="group relative h-20 w-20 shrink-0 overflow-hidden rounded-full border-2 border-dashed border-gray-300 bg-gray-100 transition hover:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-700"
                        >
                            {showPhoto ? (
                                <img
                                    src={displayedPhoto}
                                    alt={user.name}
                                    onLoad={() => setPhotoLoading(false)}
                                    onError={() => {
                                        setPhotoLoading(false);
                                        setPhotoFailed(true);
                                    }}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center">
                                    <UserIcon className="h-8 w-8 text-gray-400 dark:text-gray-500" />
                                </div>
                            )}

                            {/* Overlay بيظهر لما تشاور على الدايرة */}
                            <div className="absolute inset-0 flex items-center justify-center bg-gray-900/60 opacity-0 transition-opacity group-hover:opacity-100">
                                <Camera className="h-6 w-6 text-white" />
                            </div>

                            {/* Loader لحد ما الصورة تخلص تحميل */}
                            {photoLoading && (
                                <div className="absolute inset-0 flex items-center justify-center bg-gray-900/50 backdrop-blur-[1px]">
                                    <Loader2 className="h-5 w-5 animate-spin text-white" />
                                </div>
                            )}
                        </button>

                        <div className="flex flex-col gap-1">
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="text-sm font-semibold text-indigo-600 hover:underline dark:text-indigo-400"
                            >
                                {showPhoto ? 'تغيير الصورة' : 'اختيار صورة'}
                            </button>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                JPG أو PNG، مقاس مربع بيدي أفضل نتيجة
                            </span>
                        </div>

                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handlePhotoSelect}
                            className="hidden"
                        />
                    </div>
                </div>

                <div>
                    <InputLabel htmlFor="name" value="الاسم" />

                    <TextInput
                        id="name"
                        className="mt-1 block w-full"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                        isFocused
                        autoComplete="name"
                    />
                </div>

                <div>
                    <InputLabel htmlFor="email" value="البريد الإلكتروني" />

                    <TextInput
                        id="email"
                        type="email"
                        className="mt-1 block w-full"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        required
                        autoComplete="username"
                    />
                </div>

                <div>
                    <InputLabel htmlFor="phone" value="رقم الموبايل" />

                    <TextInput
                        id="phone"
                        type="tel"
                        className="mt-1 block w-full"
                        value={data.phone}
                        onChange={(e) => setData('phone', e.target.value)}
                        autoComplete="tel"
                        placeholder="01xxxxxxxxx"
                    />
                </div>

                <div>
                    <InputLabel htmlFor="grade" value="الصف الدراسي" />

                    <Listbox value={data.grade} onChange={(value) => setData('grade', value)}>
                        <div className="relative mt-1">
                            <Listbox.Button
                                id="grade"
                                className="relative flex w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-right text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                            >
                                {({ open }) => (
                                    <>
                                        <span>
                                            {data.grade
                                                ? grades.find((g) => g.value === data.grade)?.label
                                                : 'اختر الصف'}
                                        </span>
                                        <ChevronDown
                                            className={`h-4 w-4 text-gray-400 transition-transform ${
                                                open ? 'rotate-180' : ''
                                            }`}
                                        />
                                    </>
                                )}
                            </Listbox.Button>

                            <Transition
                                enter="transition ease-out duration-100"
                                enterFrom="opacity-0"
                                enterTo="opacity-100"
                                leave="transition ease-in duration-75"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                            >
                                <Listbox.Options className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border border-gray-200 bg-white py-1 text-sm shadow-lg focus:outline-none dark:border-gray-600 dark:bg-gray-700">
                                    {grades.map((grade) => (
                                        <Listbox.Option
                                            key={grade.value}
                                            value={grade.value}
                                            className={({ active }) =>
                                                `cursor-pointer select-none px-3 py-2 text-right ${
                                                    active
                                                        ? 'bg-indigo-50 text-indigo-700 dark:bg-gray-600 dark:text-white'
                                                        : 'text-gray-900 dark:text-gray-100'
                                                }`
                                            }
                                        >
                                            {grade.label}
                                        </Listbox.Option>
                                    ))}
                                </Listbox.Options>
                            </Transition>
                        </div>
                    </Listbox>
                </div>

                <div>
                    <InputLabel htmlFor="madhab" value="المذهب الفقهي" />

                    <Listbox value={data.madhab} onChange={(value) => setData('madhab', value)}>
                        <div className="relative mt-1">
                            <Listbox.Button
                                id="madhab"
                                className="relative flex w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-right text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                            >
                                {({ open }) => (
                                    <>
                                        <span>
                                            {data.madhab
                                                ? madhabs.find((m) => m.value === data.madhab)?.label
                                                : 'اختر المذهب'}
                                        </span>
                                        <ChevronDown
                                            className={`h-4 w-4 text-gray-400 transition-transform ${
                                                open ? 'rotate-180' : ''
                                            }`}
                                        />
                                    </>
                                )}
                            </Listbox.Button>

                            <Transition
                                enter="transition ease-out duration-100"
                                enterFrom="opacity-0"
                                enterTo="opacity-100"
                                leave="transition ease-in duration-75"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                            >
                                <Listbox.Options className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border border-gray-200 bg-white py-1 text-sm shadow-lg focus:outline-none dark:border-gray-600 dark:bg-gray-700">
                                    {madhabs.map((madhab) => (
                                        <Listbox.Option
                                            key={madhab.value}
                                            value={madhab.value}
                                            className={({ active }) =>
                                                `cursor-pointer select-none px-3 py-2 text-right ${
                                                    active
                                                        ? 'bg-indigo-50 text-indigo-700 dark:bg-gray-600 dark:text-white'
                                                        : 'text-gray-900 dark:text-gray-100'
                                                }`
                                            }
                                        >
                                            {madhab.label}
                                        </Listbox.Option>
                                    ))}
                                </Listbox.Options>
                            </Transition>
                        </div>
                    </Listbox>
                </div>

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div>
                        <p className="mt-2 text-sm text-gray-800 dark:text-gray-200">
                            عنوان البريد الإلكتروني الخاص بك غير مفعل.
                            <Link
                                href={route('verification.send')}
                                method="post"
                                as="button"
                                className="rounded text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:text-gray-400 dark:hover:text-gray-100 dark:focus:ring-offset-gray-800 ms-2"
                            >
                                انقر هنا لإعادة إرسال بريد التفعيل.
                            </Link>
                        </p>

                        {status === 'verification-link-sent' && (
                            <div className="mt-2 text-sm font-medium text-green-600 dark:text-green-400">
                                تم إرسال رابط تفعيل جديد إلى عنوان بريدك الإلكتروني.
                            </div>
                        )}
                    </div>
                )}

                <div className="flex items-center gap-4">
                    <PrimaryButton type="submit" disabled={processing}>
                        حفظ
                    </PrimaryButton>
                </div>
            </form>
        </section>
    );
}