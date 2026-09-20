import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import { Listbox } from '@headlessui/react';
import Swal from 'sweetalert2';
import { ChevronDown, Camera, Loader2 } from 'lucide-react';

const inputClasses =
    'mt-2.5 block w-full rounded border-2 border-primary/15 bg-offwhite/60 px-5 py-3.5 text-base font-semibold text-primary placeholder:font-normal focus:border-gold focus:ring-gold/30 dark:border-white/10 dark:bg-white/5 dark:text-white';

const inputErrorClasses =
    'border-red-500 focus:border-red-500 focus:ring-red-500/30';

// select مبني على daisyUI عشان يبقى شكله سليم في الدارك مود

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

const EGYPT_PHONE_REGEX = /^01[0125][0-9]{8}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// قواعد التحقق اللحظي لكل حقل
function validateField(field, value, allData) {
    switch (field) {
        case 'name':
            if (!value.trim()) return 'الاسم مطلوب';
            if (value.trim().length < 3) return 'الاسم قصير أوي';
            if (value.trim().split(/\s+/).length < 2)
                return 'من فضلك اكتب الاسم كامل';
            return null;

        case 'email':
            if (!value.trim()) return 'البريد الإلكتروني مطلوب';
            if (!EMAIL_REGEX.test(value))
                return 'صيغة البريد الإلكتروني غير صحيحة';
            return null;

        case 'phone':
            if (!value.trim()) return 'رقم الموبايل مطلوب';
            if (!EGYPT_PHONE_REGEX.test(value))
                return 'رقم الموبايل غير صحيح (لازم يبدأ بـ 010/011/012/015 و11 رقم)';
            return null;

        case 'grade':
            if (!value) return 'اختار الصف الدراسي';
            return null;

        case 'madhab':
            // المذهب اختياري، فمفيش validation لازم
            return null;

        case 'password':
            if (!value) return 'كلمة المرور مطلوبة';
            if (value.length < 8)
                return 'كلمة المرور لازم تكون 8 حروف على الأقل';
            return null;

        case 'password_confirmation':
            if (!value) return 'تأكيد كلمة المرور مطلوب';
            if (value !== allData.password)
                return 'كلمة المرور وتأكيدها مش متطابقين';
            return null;

        default:
            return null;
    }
}

export default function Register() {
    const { data, setData, post, processing, errors, reset, clearErrors } =
        useForm({
            name: '',
            email: '',
            phone: '',
            grade: '',
            madhab: '',
            password: '',
            password_confirmation: '',
            profile_photo: null,
        });

    // أخطاء التحقق اللحظي (client-side)، منفصلة عن أخطاء السيرفر
    const [liveErrors, setLiveErrors] = useState({});
    const [touched, setTouched] = useState({});

    // معاينة وتحميل الصورة الشخصية
    const [photoPreview, setPhotoPreview] = useState(null);
    const [photoLoading, setPhotoLoading] = useState(false);
    const fileInputRef = useRef(null);

    const handlePhotoSelect = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setData('profile_photo', file);

        if (errors.profile_photo) {
            clearErrors('profile_photo');
        }

        const reader = new FileReader();
        reader.onload = (ev) => {
            setPhotoLoading(true); // هيفضل true لحد ما الـ <img> نفسها تخلص تحميل
            setPhotoPreview(ev.target.result);
        };
        reader.readAsDataURL(file);
    };

    const handleChange = (field) => (e) => {
        const value = e.target.value;
        setData(field, value);

        // امسح خطأ السيرفر لنفس الحقل أول ما المستخدم يكتب فيه
        if (errors[field]) {
            clearErrors(field);
        }

        // اتحقق لحظيًا لو الحقل اتلمس قبل كده
        if (touched[field]) {
            setLiveErrors((prev) => ({
                ...prev,
                [field]: validateField(field, value, { ...data, [field]: value }),
            }));
        }

        // كلمة المرور بتأثر على تأكيد كلمة المرور
        if (field === 'password' && touched.password_confirmation) {
            setLiveErrors((prev) => ({
                ...prev,
                password_confirmation: validateField(
                    'password_confirmation',
                    data.password_confirmation,
                    { ...data, password: value },
                ),
            }));
        }
    };

    const handleBlur = (field) => () => {
        setTouched((prev) => ({ ...prev, [field]: true }));
        setLiveErrors((prev) => ({
            ...prev,
            [field]: validateField(field, data[field], data),
        }));
    };

    // أخطاء السيرفر (Laravel) لسه بتتعرض في SweetAlert زي ما هي
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
            confirmButtonColor: '#c9a227',
        });
    }, [errors]);

    const fieldClasses = (field) =>
        `${inputClasses} ${
            (liveErrors[field] || errors[field]) ? inputErrorClasses : ''
        }`;

    // const selectFieldClasses = (field) =>
    //     `${selectClasses} ${
    //         (liveErrors[field] || errors[field]) ? inputErrorClasses : ''
    //     }`;

    const submit = (e) => {
        e.preventDefault();

        // اتحقق من كل الحقول قبل الإرسال
        const allFields = [
            'name',
            'email',
            'phone',
            'grade',
            'madhab',
            'password',
            'password_confirmation',
        ];
        const newErrors = {};
        allFields.forEach((field) => {
            const err = validateField(field, data[field], data);
            if (err) newErrors[field] = err;
        });

        setTouched(
            allFields.reduce((acc, f) => ({ ...acc, [f]: true }), {}),
        );
        setLiveErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            Swal.fire({
                icon: 'warning',
                title: 'راجع البيانات',
                html: Object.values(newErrors)
                    .map((msg) => `<div class="text-right">${msg}</div>`)
                    .join(''),
                confirmButtonText: 'حسنًا',
                confirmButtonColor: '#c9a227',
            });
            return;
        }

        post(route('register'), {
            forceFormData: true,
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title="إنشاء حساب" />

            <div className="mb-11">
                <h1 className="text-3xl font-bold text-primary dark:text-white">
                    إنشاء حساب جديد
                </h1>
                <p className="mt-2.5 text-base text-primary/50 dark:text-white/50">
                    سجّل بياناتك عشان تبدأ رحلتك التعليمية معانا.
                </p>
            </div>

            <form onSubmit={submit} noValidate>
                <div>
                    <InputLabel
                        htmlFor="name"
                        value="الاسم ثلاثي"
                        className="text-base font-semibold"
                    />

                    <TextInput
                        id="name"
                        name="name"
                        value={data.name}
                        className={fieldClasses('name')}
                        autoComplete="name"
                        isFocused={true}
                        onChange={handleChange('name')}
                        onBlur={handleBlur('name')}
                    />

                    <InputError
                        message={liveErrors.name || errors.name}
                        className="mt-2"
                    />
                </div>

                <div className="mt-6">
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
                        className={fieldClasses('email')}
                        autoComplete="username"
                        onChange={handleChange('email')}
                        onBlur={handleBlur('email')}
                    />

                    <InputError
                        message={liveErrors.email || errors.email}
                        className="mt-2"
                    />
                </div>

                <div className="mt-6">
                    <InputLabel
                        htmlFor="phone"
                        value="رقم الموبايل"
                        className="text-base font-semibold"
                    />

                    <TextInput
                        id="phone"
                        type="tel"
                        name="phone"
                        value={data.phone}
                        className={fieldClasses('phone')}
                        autoComplete="tel"
                        placeholder="01xxxxxxxxx"
                        onChange={handleChange('phone')}
                        onBlur={handleBlur('phone')}
                    />

                    <InputError
                        message={liveErrors.phone || errors.phone}
                        className="mt-2"
                    />
                </div>

                <div className="mt-6">
                    <InputLabel
                        htmlFor="grade"
                        value="الصف الدراسي"
                        className="text-base font-semibold"
                    />

                    <Listbox
                        value={data.grade}
                        onChange={(value) => {
                            setData('grade', value);

                            if (errors.grade) {
                                clearErrors('grade');
                            }

                            setTouched((prev) => ({
                                ...prev,
                                grade: true,
                            }));

                            setLiveErrors((prev) => ({
                                ...prev,
                                grade: validateField('grade', value, {
                                    ...data,
                                    grade: value,
                                }),
                            }));
                        }}
                    >
                        <div className="relative mt-2.5">
                            <Listbox.Button
                                id="grade"
                                className={`relative flex w-full items-center justify-between rounded border-2 bg-offwhite/60 px-5 py-3.5 text-right text-base font-semibold text-primary outline-none transition
                                    dark:bg-white/5 dark:text-white
                                    ${
                                        liveErrors.grade || errors.grade
                                            ? 'border-red-500'
                                            : 'border-primary/15 dark:border-white/10'
                                    }
                                    focus:border-gold focus:ring-2 focus:ring-gold/30`}
                            >
                                {({ open }) => (
                                    <>
                                        <span>
                                            {data.grade
                                                ? grades.find((g) => g.value === data.grade)?.label
                                                : 'اختر الصف'}
                                        </span>

                                        <ChevronDown
                                            className={`h-5 w-5 transition-all duration-200 ${
                                                open
                                                    ? 'rotate-180 text-gold'
                                                    : 'text-primary/50 dark:text-white/50'
                                            }`}
                                        />
                                    </>
                                )}
                            </Listbox.Button>

                            <Listbox.Options className="absolute z-50 mt-2 max-h-60 w-full overflow-auto rounded border border-primary/10 bg-white p-2 shadow-xl outline-none dark:border-white/10 dark:bg-gray-800">
                                {grades.map((grade) => (
                                    <Listbox.Option
                                        key={grade.value}
                                        value={grade.value}
                                        className={({ active }) =>
                                            `relative cursor-pointer select-none rounded px-4 py-3 text-right font-semibold transition ${
                                                active
                                                    ? 'bg-primary/10 text-primary dark:bg-white/10 dark:text-white'
                                                    : 'text-primary dark:text-white'
                                            }`
                                        }
                                    >
                                        {({ selected }) => (
                                            <div className="flex items-center justify-between">
                                                <span>{grade.label}</span>

                                                {selected && (
                                                    <svg
                                                        className="h-5 w-5 text-gold"
                                                        viewBox="0 0 20 20"
                                                        fill="currentColor"
                                                    >
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M16.704 5.29a1 1 0 010 1.42l-7.2 7.2a1 1 0 01-1.42 0l-3.2-3.2a1 1 0 011.42-1.42l2.49 2.49 6.49-6.49a1 1 0 011.42 0z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                )}
                                            </div>
                                        )}
                                    </Listbox.Option>
                                ))}
                            </Listbox.Options>
                        </div>
                    </Listbox>

                    <InputError
                        message={liveErrors.grade || errors.grade}
                        className="mt-2"
                    />
                </div>

                <div className="mt-6">
                    <InputLabel
                        htmlFor="madhab"
                        value="المذهب الفقهي"
                        className="text-base font-semibold"
                    />

                    <Listbox
                        value={data.madhab}
                        onChange={(value) => {
                            setData('madhab', value);

                            if (errors.madhab) {
                                clearErrors('madhab');
                            }

                            setTouched((prev) => ({
                                ...prev,
                                madhab: true,
                            }));

                            setLiveErrors((prev) => ({
                                ...prev,
                                madhab: validateField('madhab', value, {
                                    ...data,
                                    madhab: value,
                                }),
                            }));
                        }}
                    >
                        <div className="relative mt-2.5">
                            <Listbox.Button
                                id="madhab"
                                className={`relative flex w-full items-center justify-between rounded border-2 bg-offwhite/60 px-5 py-3.5 text-right text-base font-semibold text-primary outline-none transition
                                    dark:bg-white/5 dark:text-white
                                    ${
                                        liveErrors.madhab || errors.madhab
                                            ? 'border-red-500'
                                            : 'border-primary/15 dark:border-white/10'
                                    }
                                    focus:border-gold focus:ring-2 focus:ring-gold/30`}
                            >
                                {({ open }) => (
                                    <>
                                        <span>
                                            {data.madhab
                                                ? madhabs.find((m) => m.value === data.madhab)?.label
                                                : 'اختر المذهب'}
                                        </span>

                                        <ChevronDown
                                            className={`h-5 w-5 transition-all duration-200 ${
                                                open
                                                    ? 'rotate-180 text-gold'
                                                    : 'text-primary/50 dark:text-white/50'
                                            }`}
                                        />
                                    </>
                                )}
                            </Listbox.Button>

                            <Listbox.Options className="absolute z-50 mt-2 max-h-60 w-full overflow-auto rounded border border-primary/10 bg-white p-2 shadow-xl outline-none dark:border-white/10 dark:bg-gray-800">
                                {madhabs.map((madhab) => (
                                    <Listbox.Option
                                        key={madhab.value}
                                        value={madhab.value}
                                        className={({ active }) =>
                                            `relative cursor-pointer select-none rounded px-4 py-3 text-right font-semibold transition ${
                                                active
                                                    ? 'bg-primary/10 text-primary dark:bg-white/10 dark:text-white'
                                                    : 'text-primary dark:text-white'
                                            }`
                                        }
                                    >
                                        {({ selected }) => (
                                            <div className="flex items-center justify-between">
                                                <span>{madhab.label}</span>

                                                {selected && (
                                                    <svg
                                                        className="h-5 w-5 text-gold"
                                                        viewBox="0 0 20 20"
                                                        fill="currentColor"
                                                    >
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M16.704 5.29a1 1 0 010 1.42l-7.2 7.2a1 1 0 01-1.42 0l-3.2-3.2a1 1 0 011.42-1.42l2.49 2.49 6.49-6.49a1 1 0 011.42 0z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                )}
                                            </div>
                                        )}
                                    </Listbox.Option>
                                ))}
                            </Listbox.Options>
                        </div>
                    </Listbox>

                    <InputError
                        message={liveErrors.madhab || errors.madhab}
                        className="mt-2"
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
                        className={fieldClasses('password')}
                        autoComplete="new-password"
                        onChange={handleChange('password')}
                        onBlur={handleBlur('password')}
                    />

                    <InputError
                        message={liveErrors.password || errors.password}
                        className="mt-2"
                    />
                </div>

                <div className="mt-6">
                    <InputLabel
                        htmlFor="password_confirmation"
                        value="تأكيد كلمة المرور"
                        className="text-base font-semibold"
                    />

                    <TextInput
                        id="password_confirmation"
                        type="password"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        className={fieldClasses('password_confirmation')}
                        autoComplete="new-password"
                        onChange={handleChange('password_confirmation')}
                        onBlur={handleBlur('password_confirmation')}
                    />

                    <InputError
                        message={
                            liveErrors.password_confirmation ||
                            errors.password_confirmation
                        }
                        className="mt-2"
                    />
                </div>

                {/* الصورة الشخصية */}
                <div className="mt-6">
                    <InputLabel
                        htmlFor="profile_photo"
                        value="الصورة الشخصية (اختياري)"
                        className="text-base font-semibold"
                    />

                    <div className="mt-2.5 flex items-center gap-5">
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="group relative h-24 w-24 shrink-0 overflow-hidden rounded-full border-2 border-dashed border-primary/20 bg-offwhite/60 transition hover:border-gold focus:outline-none focus:ring-2 focus:ring-gold/40 dark:border-white/10 dark:bg-white/5"
                        >
                            {photoPreview ? (
                                <img
                                    src={photoPreview}
                                    alt="الصورة الشخصية"
                                    onLoad={() => setPhotoLoading(false)}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center">
                                    <Camera className="h-7 w-7 text-primary/30 dark:text-white/30" />
                                </div>
                            )}

                            {/* Overlay بيظهر لما تشاور على الدايرة */}
                            <div className="absolute inset-0 flex items-center justify-center bg-primary/60 opacity-0 transition-opacity group-hover:opacity-100">
                                <Camera className="h-6 w-6 text-white" />
                            </div>

                            {/* Loader لحد ما الصورة تخلص تحميل */}
                            {photoLoading && (
                                <div className="absolute inset-0 flex items-center justify-center bg-primary/50 backdrop-blur-[1px]">
                                    <Loader2 className="h-6 w-6 animate-spin text-white" />
                                </div>
                            )}
                        </button>

                        <div className="flex flex-col gap-1">
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="text-sm font-semibold text-gold hover:underline"
                            >
                                {photoPreview ? 'تغيير الصورة' : 'اختيار صورة'}
                            </button>
                            <span className="text-xs text-primary/50 dark:text-white/50">
                                JPG أو PNG، مقاس مربع بيدي أفضل نتيجة
                            </span>
                        </div>

                        <input
                            ref={fileInputRef}
                            id="profile_photo"
                            type="file"
                            accept="image/*"
                            onChange={handlePhotoSelect}
                            className="hidden"
                        />
                    </div>

                    <InputError
                        message={errors.profile_photo}
                        className="mt-2"
                    />
                </div>

                <div className="mt-10">
                    <PrimaryButton
                        disabled={processing}
                        type="submit"
                        className="py-4 text-lg"
                    >
                        إنشاء حساب
                    </PrimaryButton>
                </div>

                <div className="mt-6 text-center">
                    <Link
                        href={route('login')}
                        className="rounded text-sm text-primary/55 underline decoration-primary/20 underline-offset-2 hover:text-primary focus:outline-none focus:ring-2 focus:ring-gold/40 focus:ring-offset-2 dark:text-white/50 dark:hover:text-white dark:focus:ring-offset-gray-900"
                    >
                        عندك حساب بالفعل؟ سجّل دخولك
                    </Link>
                </div>
            </form>
        </GuestLayout>
    );
}