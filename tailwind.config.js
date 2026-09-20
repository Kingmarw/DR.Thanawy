// import defaultTheme from 'tailwindcss/defaultTheme';
// import forms from '@tailwindcss/forms';
import daisyui from 'daisyui';
/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],

// tailwind.config.js
    darkMode: 'class',
    theme: {
        extend: {
        colors: {
            primary: {
            DEFAULT: '#0B2A4A',   // أزرق داكن
            light: '#1769AA',     // أزرق متوسط
            },
            gold: '#C99A2E',
            offwhite: '#F8F7F2',
        },
        fontFamily: {
            sans: ['Cairo', 'sans-serif'],
        },
        },
    },


    plugins: [daisyui], //forms,
};
