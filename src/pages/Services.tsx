import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, ArrowUpRight, Mail, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Layout } from '../components/layout/Layout';

const services = [
    { number: '01', title: 'Architecture', description: 'From first principles to build-ready detail, we create clear spatial systems shaped by climate, context, and daily life.', features: ['Concept development', 'Planning & elevations', '3D visualisation', 'Construction drawings'], promise: 'Buildings that belong to their site—and remain clear from the first sketch to the last junction.', focus: ['Site, climate and orientation', 'Planning, massing and circulation', 'Façade and material language', 'Structural and services coordination'], stages: ['Listen', 'Frame', 'Resolve', 'Document'], fit: 'New residences, villas, commercial buildings and thoughtful transformations.', output: 'Concept book · Planning package · Coordinated drawings · Site clarifications' },
    { number: '02', title: 'Interior environments', description: 'Layered spaces with a strong material identity—resolved through furniture, lighting, texture, and movement.', features: ['Space planning', 'Material curation', 'Furniture design', 'Lighting strategy'], promise: 'Interiors composed as complete environments, where light, tactility and everyday movement work together.', focus: ['Spatial planning and flow', 'Material and colour systems', 'Lighting atmospheres', 'Custom furniture and details'], stages: ['Understand', 'Compose', 'Prototype', 'Refine'], fit: 'Homes, workplaces, hospitality and retail spaces requiring a distinct identity.', output: 'Mood and material studies · 3D views · Detail drawings · Furniture schedules' },
    { number: '03', title: 'Spatial strategy', description: 'We find the most valuable use of a site, floorplate, or brand environment before design begins.', features: ['Feasibility studies', 'Master planning', 'Experience mapping', 'Design direction'], promise: 'A precise spatial brief before expensive decisions are made—aligning ambition, use and opportunity.', focus: ['Site and floorplate potential', 'User journeys and adjacencies', 'Area programming', 'Brand and experience principles'], stages: ['Audit', 'Map', 'Test', 'Direct'], fit: 'Early-stage developments, evolving businesses and projects with multiple possible directions.', output: 'Opportunity map · Test-fit options · Experience principles · Design brief' },
    { number: '04', title: 'Project delivery', description: 'A coordinated path from documentation to handover, with design intent protected at every stage.', features: ['Cost planning', 'Vendor coordination', 'Site supervision', 'Quality control'], promise: 'The discipline that turns design intent into a finished space—without losing clarity on site.', focus: ['Scope and cost alignment', 'Consultant and vendor coordination', 'Site reviews and approvals', 'Snagging and final handover'], stages: ['Plan', 'Coordinate', 'Inspect', 'Close'], fit: 'Clients who want a single, accountable design voice through execution.', output: 'Tender package · Review records · Site reports · Handover checklist' },
];

function WhatsAppMark() {
    return <svg viewBox="0 0 32 32" aria-hidden="true"><path fill="currentColor" d="M16 3a12.7 12.7 0 0 0-11 19.1L3.4 28.6l6.7-1.6A12.8 12.8 0 1 0 16 3Zm0 2.3a10.4 10.4 0 1 1-5.2 19.4l-.4-.2-3.9.9.9-3.8-.3-.4A10.4 10.4 0 0 1 16 5.3Zm-5.6 5.1c-.3 0-.7.1-1 .5-.4.4-1.3 1.3-1.3 3.1s1.3 3.6 1.5 3.8c.2.3 2.6 4 6.3 5.5 3.1 1.2 3.8 1 4.5.9.7-.1 2.2-.9 2.5-1.8.3-.9.3-1.7.2-1.8-.1-.2-.4-.3-.8-.5l-2.7-1.3c-.4-.1-.7-.2-1 .3l-1.2 1.5c-.2.3-.5.3-.9.1a8.7 8.7 0 0 1-2.6-1.6 9.7 9.7 0 0 1-1.8-2.3c-.2-.4 0-.6.2-.8l.6-.7.4-.7c.1-.3.1-.5 0-.7l-1.2-2.8c-.3-.7-.6-.7-.9-.7h-.8Z" /></svg>;
}

export function Services() {
    const [selectedService, setSelectedService] = useState<(typeof services)[number] | null>(null);
    useEffect(() => {
        const closeOnEscape = (event: KeyboardEvent) => { if (event.key === 'Escape') setSelectedService(null); };
        window.addEventListener('keydown', closeOnEscape);
        return () => window.removeEventListener('keydown', closeOnEscape);
    }, []);

    return (
        <Layout>
            <section className="relative overflow-hidden px-5 pb-20 pt-36 md:px-10 md:pb-32 md:pt-48">
                <div className="architectural-grid absolute inset-0 opacity-60" />
                <div className="relative mx-auto max-w-[1500px]">
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="eyebrow">Capabilities</motion.p>
                    <motion.div initial={{ opacity: 0, y: 35 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: [0.16,1,0.3,1] }} className="mt-8 grid gap-10 lg:grid-cols-[1.3fr_0.7fr] lg:items-end">
                        <h1 className="display-serif max-w-5xl text-6xl leading-[0.9] md:text-9xl">Design, carried all the way through.</h1>
                        <p className="max-w-md text-base leading-7 text-white/48">One multidisciplinary team for the full life of a space—from the essential idea to the final material junction.</p>
                    </motion.div>
                </div>
            </section>

            <section className="border-t hairline px-5 pb-28 md:px-10 md:pb-40">
                <div className="mx-auto max-w-[1500px]">
                    {services.map((service, index) => (
                        <motion.button type="button" key={service.title} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: index * 0.05 }} onClick={() => setSelectedService(service)} aria-expanded={selectedService?.number === service.number} className="service-row group grid w-full gap-7 border-b hairline py-10 text-left md:grid-cols-[0.16fr_0.65fr_0.8fr_0.95fr_auto] md:items-start md:py-14">
                            <span className="text-[10px] tracking-[0.2em] text-[#c8aa7c]">{service.number}</span>
                            <h2 className="display-serif text-4xl leading-none md:text-5xl">{service.title}</h2>
                            <p className="max-w-md text-sm leading-6 text-white/46">{service.description}</p>
                            <ul className="grid grid-cols-2 gap-x-5 gap-y-3 text-[10px] uppercase tracking-[0.12em] text-white/38">
                                {service.features.map((feature) => <li key={feature} className="border-l border-[#c8aa7c]/45 pl-3">{feature}</li>)}
                            </ul>
                            <ArrowUpRight className="text-white/25 transition-all group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-[#c8aa7c]" />
                        </motion.button>
                    ))}
                </div>
            </section>

            <section className="bg-[#d2c7b3] px-5 py-20 text-[#11110f] md:px-10 md:py-28">
                <div className="mx-auto grid max-w-[1500px] gap-8 md:grid-cols-[1fr_auto] md:items-end">
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.18em] opacity-50">Have a brief in mind?</p>
                        <h2 className="display-serif mt-5 max-w-4xl text-5xl leading-[0.95] md:text-8xl">Let’s find its clearest form.</h2>
                    </div>
                    <Link to="/contact" className="group flex items-center gap-4 text-[11px] font-bold uppercase tracking-[0.16em]">Start a project <ArrowRight className="transition-transform group-hover:translate-x-2" /></Link>
                </div>
            </section>

            <motion.div className="service-contact-dock" animate={{ left: selectedService ? '25%' : '50%' }} transition={{ duration: .7, ease: [0.16, 1, 0.3, 1] }}>
                <a href="https://wa.me/919347954461" target="_blank" rel="noreferrer" aria-label="Chat with Squares N Cubes on WhatsApp" title="WhatsApp"><WhatsAppMark /></a>
                <a href="mailto:hello@thesquaresncubes.in" aria-label="Email Squares N Cubes" title="Email"><Mail size={17} /></a>
            </motion.div>

            <AnimatePresence>
                {selectedService && <motion.aside key={selectedService.number} className="service-drawer" role="dialog" aria-modal="false" aria-labelledby="service-drawer-title"
                    initial={{ x: '102%' }} animate={{ x: 0 }} exit={{ x: '102%' }} transition={{ duration: .72, ease: [0.16, 1, 0.3, 1] }}>
                    <div className="service-drawer-grid" />
                    <div className="service-drawer-head"><span>{selectedService.number} / Capability</span><button onClick={() => setSelectedService(null)} aria-label="Close service details"><X size={19} /></button></div>
                    <div className="service-drawer-body">
                        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .22, duration: .55 }}>
                            <p className="service-drawer-kicker">What we bring into focus</p>
                            <h2 id="service-drawer-title">{selectedService.title}</h2>
                            <p className="service-drawer-promise">{selectedService.promise}</p>
                        </motion.div>

                        <div className="service-drawer-section">
                            <span>Core scope</span>
                            <ul>{selectedService.focus.map((item, index) => <li key={item}><small>{String(index + 1).padStart(2, '0')}</small>{item}</li>)}</ul>
                        </div>

                        <div className="service-drawer-section">
                            <span>Working sequence</span>
                            <ol className="service-sequence">{selectedService.stages.map((stage, index) => <li key={stage}><small>0{index + 1}</small><strong>{stage}</strong></li>)}</ol>
                        </div>

                        <div className="service-drawer-facts"><div><span>Best suited to</span><p>{selectedService.fit}</p></div><div><span>Typical output</span><p>{selectedService.output}</p></div></div>
                    </div>
                    <Link to="/contact" className="service-drawer-cta">Discuss this service <ArrowUpRight size={18} /></Link>
                </motion.aside>}
            </AnimatePresence>
        </Layout>
    );
}
