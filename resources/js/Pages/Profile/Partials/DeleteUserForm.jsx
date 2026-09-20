import DangerButton from '@/Components/DangerButton';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import { useForm } from '@inertiajs/react';
import { useRef, useState } from 'react';
import { usePressSound } from '@/Hooks/Usepresssound';

export default function DeleteUserForm({ className = '' }) {
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const passwordInput = useRef();
    
    // استدعاء دالة الصوت بشكل صحيح
    const playSound = usePressSound('C6');

    const {
        data,
        setData,
        delete: destroy,
        processing,
        reset,
        errors,
        clearErrors,
    } = useForm({
        password: '',
    });

    const confirmUserDeletion = () => {
        playSound(); // تشغيل الصوت عند الضغط
        setConfirmingUserDeletion(true);
    };

    const deleteUser = (e) => {
        e.preventDefault();

        destroy(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current.focus(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmingUserDeletion(false);
        clearErrors();
        reset();
    };

    return (
        <section className={`space-y-6 ${className}`}>
            <header>
                <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    حذف الحساب
                </h2>

                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    بمجرد حذف حسابك، سيتم حذف جميع موارد البيانات الخاصة به نهائياً. قبل حذف حسابك، يرجى تحميل أي بيانات أو معلومات ترغب في الاحتفاظ بها.
                </p>
            </header>

            <DangerButton onClick={confirmUserDeletion}>
                حذف الحساب
            </DangerButton>

            <Modal show={confirmingUserDeletion} onClose={closeModal}>
                <form onSubmit={deleteUser} className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                        هل أنت متأكد من رغبتك في حذف حسابك؟
                    </h2>

                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                        بمجرد حذف حسابك، سيتم حذف جميع موارد البيانات الخاصة به نهائياً. يرجى إدخال كلمة المرور الخاصة بك لتأكيد رغبتك في حذف حسابك بشكل دائم.
                    </p>

                    <div className="mt-6">
                        <InputLabel
                            htmlFor="password"
                            value="كلمة المرور"
                            className="sr-only"
                        />

                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            ref={passwordInput}
                            value={data.password}
                            onChange={(e) =>
                                setData('password', e.target.value)
                            }
                            className="mt-1 block w-3/4"
                            isFocused
                            placeholder="كلمة المرور"
                        />

                        <InputError
                            message={errors.password}
                            className="mt-2"
                        />
                    </div>

                    <div className="mt-6 flex justify-end">
                        <SecondaryButton onClick={closeModal}>
                            إلغاء
                        </SecondaryButton>

                        <DangerButton type='submit' className="ms-3" disabled={processing}>
                            حذف الحساب
                        </DangerButton>
                    </div>
                </form>
            </Modal>
        </section>
    );
}