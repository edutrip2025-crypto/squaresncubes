import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Instagram, Linkedin } from 'lucide-react';
import { Navbar } from './Navbar';
import { BrandLogo } from '../BrandLogo';

export function Layout({ children }: { children: ReactNode }) {
    return (
        <div className="noise min-h-screen bg-[#0b0b0a] text-[#f1eee7]">
            <Navbar />
            <main>{children}</main>
            <footer className="border-t hairline bg-[#090908] px-5 pb-8 pt-16 md:px-10 md:pt-24">
                <div className="mx-auto max-w-[1500px]">
                    <div className="grid gap-14 lg:grid-cols-[1.5fr_0.7fr_0.8fr]">
                        <div>
                            <p className="eyebrow mb-6">Begin a conversation</p>
                            <Link to="/contact" className="display-serif group block max-w-3xl text-5xl leading-[0.96] md:text-7xl">
                                Let’s shape what’s next.
                                <ArrowUpRight className="inline-block mb-1 ml-4 shrink-0 text-[#c8aa7c] transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" size={34} />
                            </Link>
                        </div>
                        <div className="text-sm leading-7 text-white/55">
                            <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-white/30">Studio</p>
                            <p>10th floor, Awfis<br />Prestige Shantiniketan<br />Bengaluru — 560048</p>
                        </div>
                        <div className="text-sm leading-7 text-white/55">
                            <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-white/30">Connect</p>
                            <a href="mailto:hello@thesquaresncubes.in" className="block hover:text-[#c8aa7c]">hello@thesquaresncubes.in</a>
                            <a href="tel:+919347954461" className="block hover:text-[#c8aa7c]">+91 93479 54461</a>
                            <div className="mt-4 flex gap-4">
                                <a href="https://www.instagram.com/squares_n_cubes_studio/" target="_blank" rel="noreferrer" aria-label="Instagram"><Instagram size={18} /></a>
                                <a href="https://www.linkedin.com/company/squares-n-cubes" target="_blank" rel="noreferrer" aria-label="LinkedIn"><Linkedin size={18} /></a>
                            </div>
                        </div>
                    </div>
                    <div className="mt-20 flex flex-col gap-4 border-t hairline pt-6 text-[10px] uppercase tracking-[0.16em] text-white/30 sm:flex-row sm:items-center sm:justify-between">
                        <span className="flex items-center gap-3"><BrandLogo className="footer-brand-logo" />© {new Date().getFullYear()} Squares N Cubes</span>
                        <span>Architecture · Interiors · Spatial Strategy</span>
                    </div>
                </div>
            </footer>
        </div>
    );
}
