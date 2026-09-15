import { useId } from 'react';

export function BrandLogo({ tone = 'white', className = '' }: {
    tone?: 'white' | 'black';
    className?: string;
}) {
    const filterId = useId().replace(/:/g, '');
    const value = tone === 'white' ? 1 : 0;
    return <svg viewBox="0 0 500 500" width={500} height={500} aria-hidden="true"
        className={`brand-logo ${className}`}>
        <defs>
            <filter id={filterId} colorInterpolationFilters="sRGB" x="0" y="0" width="100%" height="100%">
                {/* Close subpixel seams in the white silhouette before applying its fill. */}
                <feMorphology in="SourceAlpha" operator="dilate" radius={tone === 'white' ? 1 : 0} result="silhouette" />
                <feColorMatrix in="silhouette" type="matrix"
                    values={`0 0 0 0 ${value} 0 0 0 0 ${value} 0 0 0 0 ${value} 0 0 0 1 0`} result="letters" />
                {/* The original gold has red > blue; the neutral S and C do not. */}
                <feColorMatrix in="SourceGraphic" type="matrix"
                    values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 10 0 -10 0 -1.5" result="goldMask" />
                <feComposite in="SourceGraphic" in2="goldMask" operator="in" result="gold" />
                <feMerge><feMergeNode in="letters" /><feMergeNode in="gold" /></feMerge>
            </filter>
        </defs>
        <image href="/studio-logo.png" width="500" height="500" filter={`url(#${filterId})`} />
    </svg>;
}
