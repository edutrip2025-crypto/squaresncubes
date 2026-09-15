import { motion } from 'framer-motion';
import { ArrowUpRight, Mail, MapPin, Phone } from 'lucide-react';
import { Layout } from '../components/layout/Layout';
import { ContactForm } from '../components/ContactForm';

export function Contact() {
    return (
        <Layout>
            <section className="contact-intake">
                <div className="contact-blueprint" />
                <div className="contact-intake-grid">
                    <motion.div initial={{ opacity: 0, x: -28 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: .85, ease: [0.16,1,0.3,1] }} className="contact-intro">
                        <p className="eyebrow">Start a project</p>
                        <h1 className="display-serif">Give the idea<br /><em>a direction.</em></h1>
                        <p className="contact-intro-copy">Tell us what is known. Leave the rest open.</p>
                        <div className="contact-coordinate"><span>12.9716° N</span><i /><span>77.5946° E</span></div>
                        <div className="contact-direct">
                            <div className="flex gap-4">
                                <MapPin size={18} className="mt-1 shrink-0 text-[#c8aa7c]" />
                                <p>10th floor, Awfis<br />Prestige Shantiniketan, Hoodi<br />Bengaluru — 560048</p>
                            </div>
                            <a href="mailto:hello@thesquaresncubes.in" className="group flex items-center gap-4 hover:text-white">
                                <Mail size={18} className="shrink-0 text-[#c8aa7c]" />hello@thesquaresncubes.in<ArrowUpRight size={14} className="opacity-40 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
                            </a>
                            <a href="tel:+919347954461" className="flex items-center gap-4 hover:text-white"><Phone size={18} className="shrink-0 text-[#c8aa7c]" />+91 93479 54461</a>
                        </div>
                    </motion.div>
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .12, duration: .8, ease: [0.16,1,0.3,1] }} className="contact-brief-shell">
                        <ContactForm />
                    </motion.div>
                </div>
            </section>
        </Layout>
    );
}
