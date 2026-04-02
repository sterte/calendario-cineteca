import React from 'react';

// Simple drop-in replacements for react-animation-components (abandoned).
// Fade wraps children in a div with a CSS fade-in; all props (className, key, etc.) pass through.
// Stagger is just a transparent wrapper — no stagger logic needed for our usage.

export const Fade = ({ in: _in, children, className, ...props }) => (
    <div className={['anim-fadein', className].filter(Boolean).join(' ')} {...props}>
        {children}
    </div>
);

export const Stagger = ({ in: _in, children }) => (
    <>{children}</>
);
