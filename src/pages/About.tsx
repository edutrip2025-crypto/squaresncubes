import { Layout } from '../components/layout/Layout';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { DraftingCompass, Ruler, Layers, BrickWall, Users, Briefcase } from 'lucide-react';

export function About() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({ target: containerRef });
    const y = useTransform(scrollYProgress, [0, 1], [0, -50]);

    return (
        <Layout>
            <div ref={containerRef} className="relative overflow-hidden">
                {/* Hero Section */}
                <section className="py-24 px-6 md:px-12 min-h-[60vh] flex flex-col justify-center relative">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="max-w-4xl z-10"
                    >
                        <h1 className="text-5xl md:text-8xl font-bold mb-8 leading-tight">
                            We build logic<br />
                            <span className="text-gray-600">into dreams</span>.
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-300 max-w-2xl leading-relaxed">
                            SquaresNCubes sits at the intersection of rigid geometry and organic life.
                            We don't just design buildings; we architect experiences.
                        </p>
                    </motion.div>

                    {/* Background Decorative Element */}
                    <motion.div
                        className="absolute right-0 top-20 opacity-10 pointer-events-none"
                        style={{ y }}
                    >
                        <DraftingCompass size={400} strokeWidth={0.5} />
                    </motion.div>
                </section>

                {/* Team Syndicate Section */}
                <section className="py-20 px-6 md:px-12 bg-white/5 border-y border-white/5">
                    <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <div>
                            <div className="flex items-center gap-3 text-sm font-mono text-blue-400 mb-4">
                                <Users size={16} />
                                <span>THE SYNDICATE</span>
                            </div>
                            <h2 className="text-3xl md:text-5xl font-bold mb-6">Collective Intelligence</h2>
                            <p className="text-gray-400 text-lg leading-relaxed">
                                We are a powerful syndicate of <strong>7 Architects</strong> and <strong>4 Civil Engineers</strong>,
                                each a specialist in their own domain. From structural integrity to aesthetic fluidity,
                                our diverse expertise converges to solve complex spatial problems. We work not as individuals,
                                but as a single, cohesive mind dedicated to precision.
                            </p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="aspect-square bg-white/5 rounded-lg border border-white/5 flex items-center justify-center group hover:bg-white/10 transition-colors">
                                    <Ruler className="text-gray-600 group-hover:text-white transition-colors" size={32} />
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Design Approach */}
                <section className="py-24 px-6 md:px-12">
                    <div className="max-w-4xl mx-auto">
                        <div className="flex items-center gap-3 text-sm font-mono text-green-400 mb-4">
                            <Briefcase size={16} />
                            <span>OUR APPROACH</span>
                        </div>
                        <h2 className="text-3xl md:text-5xl font-bold mb-8">Professional Excellence</h2>
                        <div className="prose prose-invert prose-lg text-gray-400">
                            <p>
                                Squares n' Cubes is a professional firm located in Hyderabad, India, that offers a wide range of architectural services, specializing in architectural design, construction, planning, and project management.
                            </p>
                            <p>
                                We focus on creativity, quality, innovation, and sustainability, aiming to deliver high-quality and aesthetically pleasing designs that meet the diverse needs of our clients, including residential, commercial, and industrial projects.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Material Selection */}
                <section className="py-24 px-6 md:px-12 bg-gradient-to-b from-transparent to-black">
                    <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16">
                        <div className="order-2 md:order-1 relative">
                            <div className="absolute inset-0 bg-blue-500/10 blur-3xl -z-10 rounded-full" />
                            <Layers size={120} className="text-gray-800 mb-8" />
                            <BrickWall size={80} className="text-gray-700 absolute top-20 right-20" />
                        </div>
                        <div className="order-1 md:order-2">
                            <div className="flex items-center gap-3 text-sm font-mono text-purple-400 mb-4">
                                <Layers size={16} />
                                <span>MATERIALITY</span>
                            </div>
                            <h2 className="text-3xl md:text-5xl font-bold mb-8">Curated Textures</h2>
                            <div className="space-y-6 text-gray-400 leading-relaxed">
                                <p>
                                    We strive to deliver a superior and satisfying experience to our clients by using a diverse range of high-quality materials. Each material is thoughtfully hand-picked based on the client's budget, ensuring harmony in quality, style, and price.
                                </p>
                                <p>
                                    We collaborate with reputable vendors across India, including renowned brands like <strong>Kajaria, Nitco, Orientbell, Royal Touch, Amulya</strong>, and more. Our partnerships extend to a variety of top-tier brands, enabling us to offer tailored solutions that exceed expectations.
                                </p>
                                <p className="text-sm border-l-2 border-white/20 pl-4 italic">
                                    For material selection, budgeting guidance, and brand recommendations, feel free to contact us directly. We’ll help you pick the right combination without compromising on quality or aesthetics.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </Layout>
    );
}
