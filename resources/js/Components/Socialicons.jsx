/**
 * Brand social icons as inline SVG React components.
 * Source: Font Awesome Free v7.3.1 (https://fontawesome.com) — Free license.
 * These are solid/filled brand marks, so keep them together stylistically
 * (don't mix with outline/stroke icon sets like lucide-react for the same row).
 *
 * Usage:
 *   import { FacebookIcon, YoutubeIcon } from './SocialIcons';
 *   <FacebookIcon className="h-4 w-4" />
 */

export const FacebookIcon = ({ className, ...props }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" className={className} fill="currentColor" {...props}>
        <path d="M576 320C576 178.6 461.4 64 320 64C178.6 64 64 178.6 64 320C64 440 146.7 540.8 258.2 568.5L258.2 398.2L205.4 398.2L205.4 320L258.2 320L258.2 286.3C258.2 199.2 297.6 158.8 383.2 158.8C399.4 158.8 427.4 162 438.9 165.2L438.9 236C432.9 235.4 422.4 235 409.3 235C367.3 235 351.1 250.9 351.1 292.2L351.1 320L434.7 320L420.3 398.2L351 398.2L351 574.1C477.8 558.8 576 450.9 576 320z" />
    </svg>
);

export const YoutubeIcon = ({ className, ...props }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" className={className} fill="currentColor" {...props}>
        <path d="M581.7 188.1C575.5 164.4 556.9 145.8 533.4 139.5C490.9 128 320.1 128 320.1 128C320.1 128 149.3 128 106.7 139.5C83.2 145.8 64.7 164.4 58.4 188.1C47 231 47 320.4 47 320.4C47 320.4 47 409.8 58.4 452.7C64.7 476.3 83.2 494.2 106.7 500.5C149.3 512 320.1 512 320.1 512C320.1 512 490.9 512 533.5 500.5C557 494.2 575.5 476.3 581.8 452.7C593.2 409.8 593.2 320.4 593.2 320.4C593.2 320.4 593.2 231 581.8 188.1zM264.2 401.6L264.2 239.2L406.9 320.4L264.2 401.6z" />
    </svg>
);