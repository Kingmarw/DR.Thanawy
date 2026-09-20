import { router } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';

export default function BrandContextMenu() {
    const [menu, setMenu] = useState(null); // { x, y }
    const [copied, setCopied] = useState(false);
    const [authUser, setAuthUser] = useState(null);
    const [activeIndex, setActiveIndex] = useState(-1);
    const menuRef = useRef(null);

    useEffect(() => {
        try {
            const rootEl = document.querySelector('[data-page]');
            const initialPage = JSON.parse(rootEl?.dataset?.page || '{}');
            setAuthUser(initialPage?.props?.auth?.user ?? null);
        } catch {
            setAuthUser(null);
        }

        const removeNavigate = router.on('navigate', (event) => {
            setAuthUser(event?.detail?.page?.props?.auth?.user ?? null);
        });

        return () => removeNavigate();
    }, []);

    useEffect(() => {
        const onContextMenu = (e) => {
            e.preventDefault();
            const menuWidth = 224;
            const menuHeight = 280;
            const x = Math.min(e.clientX, window.innerWidth - menuWidth - 12);
            const y = Math.min(e.clientY, window.innerHeight - menuHeight - 12);
            setCopied(false);
            setActiveIndex(-1);
            setMenu({ x, y });
        };

        const onClickAway = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) setMenu(null);
        };

        const onKeyDownBlock = (e) => {
            const blockCombo =
                e.key === 'F12' ||
                (e.ctrlKey && e.shiftKey && ['I', 'J', 'C', 'i', 'j', 'c'].includes(e.key)) ||
                (e.ctrlKey && ['U', 'u'].includes(e.key));
            if (blockCombo) e.preventDefault();
        };

        document.addEventListener('contextmenu', onContextMenu);
        document.addEventListener('mousedown', onClickAway);
        document.addEventListener('keydown', onKeyDownBlock);

        return () => {
            document.removeEventListener('contextmenu', onContextMenu);
            document.removeEventListener('mousedown', onClickAway);
            document.removeEventListener('keydown', onKeyDownBlock);
        };
    }, []);

    const items = menu
        ? [
              { label: 'رجوع', icon: 'back', action: () => window.history.back() },
              { label: 'تحديث الصفحة', icon: 'refresh', action: () => router.reload() },
              {
                  label: copied ? 'تم نسخ الرابط ✓' : 'نسخ رابط الصفحة',
                  icon: 'link',
                  keepOpen: true,
                  action: async () => {
                      try {
                          await navigator.clipboard.writeText(window.location.href);
                          setCopied(true);
                          setTimeout(() => setMenu(null), 700);
                      } catch {
                          setMenu(null);
                      }
                  },
              },
              ...(navigator.share
                  ? [
                        {
                            label: 'مشاركة الصفحة',
                            icon: 'share',
                            action: () =>
                                navigator.share({ title: 'دكتور ثانوي', url: window.location.href }).catch(() => {}),
                        },
                    ]
                  : []),
              { label: 'الرئيسية', icon: 'home', divider: true, action: () => router.visit('/') },
              ...(authUser
                  ? [
                        {
                            label: 'لوحة التحكم',
                            icon: 'panel',
                            action: () => router.visit(route('dashboard')),
                        },
                    ]
                  : []),
          ]
        : [];

    useEffect(() => {
        if (!menu) return;
        const onKeyDown = (e) => {
            if (e.key === 'Escape') {
                setMenu(null);
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                setActiveIndex((i) => (i + 1) % items.length);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setActiveIndex((i) => (i - 1 + items.length) % items.length);
            } else if (e.key === 'Enter' && activeIndex >= 0) {
                e.preventDefault();
                items[activeIndex]?.action();
                if (!items[activeIndex]?.keepOpen) setMenu(null);
            }
        };
        document.addEventListener('keydown', onKeyDown);
        return () => document.removeEventListener('keydown', onKeyDown);
    }, [menu, items, activeIndex]);

    if (!menu) return null;

    return (
        <div
            ref={menuRef}
            dir="rtl"
            role="menu"
            className="fixed z-[9998] w-56 overflow-hidden rounded-xl border border-[#C99A2E]/20 backdrop-blur-sm"
            style={{
                top: menu.y,
                left: menu.x,
                background: 'linear-gradient(160deg, #0B2A4A 0%, #123a63 100%)',
                fontFamily: "'Cairo', sans-serif",
                boxShadow: '0 12px 32px rgba(0,0,0,0.35), 0 0 0 1px rgba(201,154,46,0.08), 0 0 24px rgba(201,154,46,0.06)',
                animation: 'brand-menu-in 0.16s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
        >
            <div className="relative flex items-center gap-2 border-b border-white/10 px-4 py-3 overflow-hidden">
                <IslamicMotif />
                <svg viewBox="0 0 24 24" className="h-4 w-4 relative" fill="none" aria-hidden="true">
                    <path d="M4 20V11C4 6.6 7.6 3 12 3s8 3.6 8 8v9" stroke="#C99A2E" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
                <span
                    className="relative text-[13px] tracking-wide text-[#E4C878]"
                    style={{ fontFamily: "'Reem Kufi','Cairo',sans-serif" }}
                >
                    دكتور ثانوي
                </span>
            </div>

            <ul className="py-1.5">
                {items.map((item, i) => (
                    <li key={item.label}>
                        {item.divider && <div className="my-1.5 mx-4 h-px bg-white/10" />}
                        <button
                            role="menuitem"
                            onMouseEnter={() => setActiveIndex(i)}
                            onClick={async () => {
                                await item.action();
                                if (!item.keepOpen) setMenu(null);
                            }}
                            className="relative flex w-full items-center gap-3 px-4 py-2.5 text-right text-[13.5px] transition-colors duration-150"
                            style={{
                                color: activeIndex === i ? '#FFFFFF' : 'rgba(255,255,255,0.85)',
                                background: activeIndex === i ? 'rgba(255,255,255,0.06)' : 'transparent',
                            }}
                        >
                            <span
                                className="absolute right-0 top-0 h-full w-[2px] transition-transform duration-200 origin-top"
                                style={{
                                    background: '#C99A2E',
                                    transform: activeIndex === i ? 'scaleY(1)' : 'scaleY(0)',
                                }}
                            />
                            <MenuIcon name={item.icon} active={activeIndex === i} />
                            {item.label}
                        </button>
                    </li>
                ))}
            </ul>

            <style>{`
                @keyframes brand-menu-in {
                    from { opacity: 0; transform: scale(0.95) translateY(-6px); filter: blur(2px); }
                    to { opacity: 1; transform: scale(1) translateY(0); filter: blur(0); }
                }
            `}</style>
        </div>
    );
}

function IslamicMotif() {
    // شريط زخرفة هندسية إسلامية بسيطة شفافة خلف الهيدر
    return (
        <svg
            className="pointer-events-none absolute -left-2 -top-2 h-16 w-16 opacity-[0.07]"
            viewBox="0 0 100 100"
            fill="none"
            aria-hidden="true"
        >
            <path
                d="M50 5 L61 39 L95 39 L67 60 L78 95 L50 74 L22 95 L33 60 L5 39 L39 39 Z"
                stroke="#C99A2E"
                strokeWidth="1"
            />
        </svg>
    );
}

function MenuIcon({ name, active }) {
    const common = {
        viewBox: '0 0 24 24',
        className: `h-4 w-4 shrink-0 transition-transform duration-150 ${active ? 'scale-110' : ''}`,
        fill: 'none',
        stroke: '#C99A2E',
        strokeWidth: 1.7,
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
    };
    switch (name) {
        case 'back':
            return <svg {...common}><path d="M14 6l-6 6 6 6" /></svg>;
        case 'refresh':
            return <svg {...common}><path d="M20 12a8 8 0 10-2.34 5.66M20 8v5h-5" /></svg>;
        case 'link':
            return <svg {...common}><path d="M9 15l6-6M8 12a4 4 0 010-5.66l1.5-1.5a4 4 0 015.66 5.66M16 12a4 4 0 010 5.66l-1.5 1.5a4 4 0 01-5.66-5.66" /></svg>;
        case 'share':
            return <svg {...common}><circle cx="18" cy="5" r="2.2" /><circle cx="6" cy="12" r="2.2" /><circle cx="18" cy="19" r="2.2" /><path d="M8 10.7l8-4.4M8 13.3l8 4.4" /></svg>;
        case 'home':
            return <svg {...common}><path d="M4 11l8-7 8 7M6 9.5V20h12V9.5" /></svg>;
        case 'panel':
            return <svg {...common}><rect x="4" y="4" width="16" height="16" rx="2" /><path d="M9 4v16" /></svg>;
        default:
            return null;
    }
}