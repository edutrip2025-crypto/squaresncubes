import { motion } from 'framer-motion';
import { Layout } from '../components/layout/Layout';
import studioImage from '../assets/Commercial/Studio Retreat/A.png';
import materialImage from '../assets/Residential/Classic Indian/A.png';

const principles = [
    ['01', 'Clarity before style', 'A strong idea should make every later decision simpler—from circulation to the smallest junction.'],
    ['02', 'Material with purpose', 'We use texture, light, and craft to deepen an experience, never merely to decorate it.'],
    ['03', 'Design as one team', 'Architecture, engineering, interiors, and delivery stay in dialogue from beginning to end.'],
];

export function About() {
    return (
        <Layout>
            <section className="relative overflow-hidden px-5 pb-24 pt-36 md:px-10 md:pb-36 md:pt-48">
                <div className="architectural-grid absolute inset-0 opacity-60" />
                <div className="relative mx-auto max-w-[1500px]">
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="eyebrow">The studio</motion.p>
                    <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: [0.16,1,0.3,1] }} className="display-serif mt-8 max-w-6xl text-balance text-6xl leading-[0.9] md:text-[8.5rem]">
                        Logic into dreams. <em className="text-[#c8aa7c]">Dreams</em> into space.
                    </motion.h1>
                    <div className="mt-16 grid gap-10 border-t hairline pt-8 md:grid-cols-[0.8fr_1.2fr]">
                        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/32">Squares N Cubes / India</p>
                        <p className="max-w-2xl text-xl leading-8 text-white/60">We are a collaborative architecture and design studio working across residential, commercial, and hospitality environments. Geometry is our language; human experience is the measure.</p>
                    </div>
                </div>
            </section>

            <section className="px-5 md:px-10">
                <div className="mx-auto grid max-w-[1500px] gap-6 lg:grid-cols-[1.35fr_0.65fr] lg:items-end">
                    <motion.div initial={{ clipPath: 'inset(0 0 100% 0)' }} whileInView={{ clipPath: 'inset(0 0 0% 0)' }} viewport={{ once: true }} transition={{ duration: 1.1, ease: [0.16,1,0.3,1] }} className="aspect-[16/10] overflow-hidden">
                        <img src={studioImage} alt="Squares N Cubes studio retreat project" className="h-full w-full object-cover" />
                    </motion.div>
                    <div className="border-t hairline pt-7 lg:pb-4">
                        <span className="display-serif text-7xl text-[#c8aa7c]">11</span>
                        <p className="mt-2 text-[11px] font-bold uppercase tracking-[0.16em] text-white/45">Architects and civil engineers working as one collective mind.</p>
                    </div>
                </div>
            </section>

            <section className="px-5 py-28 md:px-10 md:py-40">
                <div className="mx-auto max-w-[1500px]">
                    <div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr]">
                        <div>
                            <p className="eyebrow">How we think</p>
                            <p className="mt-6 max-w-xs text-sm leading-6 text-white/42">Our process is rigorous, but never rigid. These are the ideas that keep it grounded.</p>
                        </div>
                        <div>
                            {principles.map(([number, title, copy], index) => (
                                <motion.div key={title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.08 }} className="grid gap-5 border-t hairline py-9 md:grid-cols-[0.15fr_0.75fr_1fr]">
                                    <span className="text-[10px] tracking-[0.18em] text-[#c8aa7c]">{number}</span>
                                    <h2 className="display-serif text-3xl">{title}</h2>
                                    <p className="max-w-md text-sm leading-6 text-white/45">{copy}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <section className="relative min-h-[72vh] overflow-hidden">
                <img src={materialImage} alt="Material-rich residential interior" className="absolute inset-0 h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/48 to-black/10" />
                <div className="relative mx-auto flex min-h-[72vh] max-w-[1500px] items-end px-5 py-16 md:px-10 md:py-24">
                    <div className="max-w-2xl">
                        <p className="eyebrow">Material intelligence</p>
                        <h2 className="display-serif mt-7 text-5xl leading-[0.95] md:text-7xl">Every surface has a job to do.</h2>
                        <p className="mt-7 max-w-xl text-sm leading-7 text-white/65">We curate materials for performance, atmosphere, budget, and longevity—working with trusted makers and vendors across India to find the right balance for every project.</p>
                    </div>
                </div>
            </section>
        </Layout>
    );
}
