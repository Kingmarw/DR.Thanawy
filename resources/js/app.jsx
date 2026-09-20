import '../css/app.css';
import './bootstrap';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import BrandContextMenu from './Components/BrandContextMenu';
const appName = import.meta.env.VITE_APP_NAME || 'Doctor_Thanawy';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob('./Pages/**/*.jsx'),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);
        
        root.render(
            <>
            <BrandContextMenu />
            <App {...props} />
            </>
            
        );
    },
    progress: {
        color: '#C99A2E',
        delay: 250,        // يستنى قد إيه قبل ما يظهر
        includeCSS: true,
        showSpinner: false,
    },
});
