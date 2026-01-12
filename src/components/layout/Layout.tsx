import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Instagram, Linkedin, Mail, Phone } from 'lucide-react';

interface LayoutProps {
    children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
    return (
        <div className="min-h-screen bg-brand-black text-white selection:bg-white selection:text-black">
            <Navbar />
            <main className="pt-20">
                {children}
            </main>
            <footer className="py-12 px-6 md:px-12 border-t border-white/10 mt-20 bg-black">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-12">
                    {/* Brand & Tagline */}
                    <div className="space-y-4">
                        <h3 className="text-2xl font-bold tracking-tighter">Squares<span className="text-gray-500">N</span>Cubes</h3>
                        <p className="text-gray-400 text-sm max-w-xs leading-relaxed">
                            Designing spaces that inspire and function with precision. <br />
                            Bengaluru • Hyderabad
                        </p>
                    </div>

                    {/* Navigation */}
                    <div className="flex gap-16 text-sm">
                        <div className="flex flex-col gap-4">
                            <span className="text-white font-semibold tracking-wide">Explore</span>
                            <div className="flex flex-col gap-2 text-gray-400">
                                <Link to="/portfolio" className="hover:text-white transition-colors">Portfolio</Link>
                                <Link to="/services" className="hover:text-white transition-colors">Services</Link>
                                <Link to="/about" className="hover:text-white transition-colors">About</Link>
                                <Link to="/contact" className="hover:text-white transition-colors">Contact</Link>
                            </div>
                        </div>

                        <div className="flex flex-col gap-4">
                            <span className="text-white font-semibold tracking-wide">Connect</span>
                            <div className="flex flex-col gap-3 text-gray-400">
                                <a href="mailto:hello@thesquaresncubes.com" className="flex items-center gap-2 hover:text-white transition-colors group">
                                    <Mail size={16} className="text-gray-500 group-hover:text-white transition-colors" />
                                    <span>hello@thesquaresncubes.com</span>
                                </a>
                                <div className="flex items-center gap-2 group hover:text-white transition-colors cursor-default">
                                    <Phone size={16} className="text-gray-500 group-hover:text-white transition-colors" />
                                    <span>+91 93479 54461</span>
                                </div>
                                <div className="flex gap-4 mt-2">
                                    <a href="https://www.instagram.com/squares_n_cubes_studio/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                                        <Instagram size={20} />
                                    </a>
                                    <a href="https://www.linkedin.com/company/squares-n-cubes" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                                        <Linkedin size={20} />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto pt-8 border-t border-white/5 mt-12 text-xs text-gray-600 flex justify-between items-center">
                    <span>© 2026 SquaresNCubes. All rights reserved.</span>
                    <span className="opacity-50">Est. 2026</span>
                </div>
            </footer>
        </div>
    );
}
