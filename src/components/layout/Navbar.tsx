import { Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { BrandLogo } from '../BrandLogo';

const navItems = [
    { name: 'Work', path: '/portfolio' },
    { name: 'Services', path: '/services' },
];

export function Navbar() {
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const lightBackground = false;

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 24);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => setIsOpen(false), [location.pathname]);

    return (
        <>
            <motion.header
                initial={{ y: -80, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${lightBackground ? 'nav-on-light' : ''} ${scrolled ? 'bg-[#0b0b0a]/88 backdrop-blur-xl border-b hairline' : 'bg-transparent'}`}
            >
                <div className="mx-auto flex h-[76px] max-w-[1500px] items-center justify-between px-5 md:px-10">
                    <Link to="/" className="group relative z-[70] flex items-center gap-3" aria-label="Squares N Cubes home">
                        <BrandLogo tone={lightBackground ? 'black' : 'white'} className="nav-brand-logo" />
                        <span className="text-[15px] font-semibold tracking-[-0.04em]">SQUARES <span className="text-[#c8aa7c]">N</span> CUBES</span>
                    </Link>

                    <nav className="hidden items-center gap-9 md:flex" aria-label="Primary navigation">
                        {navItems.map((item) => (
                            <Link key={item.path} to={item.path} className="group relative py-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#f1eee7]/60 transition-colors hover:text-[#f1eee7]">
                                {item.name}
                                <span className={`absolute inset-x-0 bottom-1 h-px origin-left bg-[#c8aa7c] transition-transform duration-300 ${location.pathname === item.path ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`} />
                            </Link>
                        ))}
                        <Link to="/contact" className="flex items-center gap-2 rounded-full border hairline px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.14em] transition-colors hover:border-[#c8aa7c] hover:bg-[#c8aa7c] hover:text-black">
                            Start a project <ArrowUpRight size={14} />
                        </Link>
                    </nav>

                    <button onClick={() => setIsOpen((value) => !value)} className="relative z-[70] grid h-11 w-11 place-items-center rounded-full border hairline md:hidden" aria-label={isOpen ? 'Close menu' : 'Open menu'}>
                        {isOpen ? <X size={19} /> : <Menu size={19} />}
                    </button>
                </div>
            </motion.header>

            <AnimatePresence>
                {isOpen && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[60] flex flex-col bg-[#0b0b0a] px-6 pb-10 pt-28 md:hidden">
                        <div className="architectural-grid absolute inset-0 opacity-60" />
                        <nav className="relative flex flex-1 flex-col justify-center gap-3">
                            {[...navItems, { name: 'Contact', path: '/contact' }].map((item, index) => (
                                <motion.div key={item.path} initial={{ opacity: 0, x: -25 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.08 * index }}>
                                    <Link to={item.path} className="display-serif flex items-center justify-between border-b hairline py-4 text-5xl">
                                        {item.name}<ArrowUpRight size={20} className="text-[#c8aa7c]" />
                                    </Link>
                                </motion.div>
                            ))}
                        </nav>
                        <p className="relative text-xs uppercase tracking-[0.17em] text-white/40">Hyderabad · Bengaluru · India</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
