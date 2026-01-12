import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/utils';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

const navItems = [
    { name: 'Portfolio', path: '/portfolio' },
    { name: 'Services', path: '/services' },
];

export function Navbar() {
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <motion.nav
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 md:px-12 md:py-6 bg-black/50 backdrop-blur-md border-b border-white/10"
        >
            <Link to="/" className="text-2xl font-bold tracking-tighter text-white z-50 hover:text-gray-300 transition-colors">
                Squares<span className="text-gray-400">N</span>Cubes
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
                {navItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={cn(
                            "text-sm font-medium transition-colors hover:text-white relative",
                            location.pathname === item.path ? "text-white" : "text-gray-400"
                        )}
                    >
                        {item.name}
                        {location.pathname === item.path && (
                            <motion.div
                                layoutId="navbar-indicator"
                                className="absolute -bottom-1 left-0 right-0 h-px bg-white"
                            />
                        )}
                    </Link>
                ))}
            </div>

            {/* Mobile Nav Toggle */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden relative z-[70] text-white"
            >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Mobile Nav Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed inset-0 bg-black/95 backdrop-blur-xl z-[60] flex flex-col items-center justify-center gap-8 md:hidden"
                    >
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={() => setIsOpen(false)}
                                className={cn(
                                    "text-2xl font-bold transition-colors",
                                    location.pathname === item.path ? "text-white" : "text-gray-500"
                                )}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
}


