import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { BrandLogo } from './BrandLogo';

export function SplashScreen({ onComplete }: { onComplete: () => void }) {
    const [isExiting, setIsExiting] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsExiting(true);
            setTimeout(onComplete, 650);
        }, 900);

        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        <motion.div
            className="fixed inset-0 z-[110] bg-black flex items-center justify-center overflow-hidden"
            initial={{ opacity: 1 }}
            animate={isExiting ? { opacity: 0 } : { opacity: 1 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
        >
            <div className="relative flex flex-col items-center">
                <motion.div
                    initial={{ rotate: -35, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="mb-6"
                >
                    <BrandLogo className="splash-brand-logo" />
                </motion.div>
                <motion.h1
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    className="text-3xl md:text-5xl font-semibold text-white tracking-[-0.05em]"
                >
                    Squares <span className="text-[#c8aa7c]">N</span> Cubes
                </motion.h1>
                <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.25, duration: 0.65, ease: "easeInOut" }}
                    className="h-px bg-[#c8aa7c]/50 mt-5 w-full origin-left"
                />
            </div>
        </motion.div>
    );
}
