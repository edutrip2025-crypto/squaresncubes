import { Layout } from '../components/layout/Layout';
import { motion } from 'framer-motion';
import { CubeScene } from '../components/3d/CubeScene';

export function Home() {
    return (
        <Layout>
            <section className="h-[80vh] flex items-center justify-center relative overflow-hidden">
                {/* Placeholder for 3D Scene */}
                <CubeScene />
                <div className="absolute inset-0 z-0 bg-gradient-to-b from-black/50 via-transparent to-black" />

                <div className="relative z-10 text-center px-4">
                    <motion.h1
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-5xl md:text-8xl font-bold tracking-tighter mb-6"
                    >
                        SQUARES<span className="text-gray-500 font-light">N</span>CUBES
                    </motion.h1>
                    <motion.p
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto"
                    >
                        Architectural Precision. Artistic Vision.
                    </motion.p>
                </div>
            </section>

            <section className="py-20 px-6 md:px-12">
                <h2 className="text-3xl font-bold mb-12 border-l-4 border-white pl-4">Featured Projects</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {[
                        { title: "Structural Architecture", image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800", desc: "Form follows function" },
                        { title: "Fluid Architecture", image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=800", desc: "Organic shapes" },
                        { title: "Interior Designs", image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=800", desc: "Living spaces" },
                        { title: "Floor Plans & Elevations", image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=800", desc: "Technical precision" }
                    ].map((item, index) => (
                        <motion.div
                            key={index}
                            whileHover={{ y: -10 }}
                            className="aspect-[4/3] rounded-sm relative overflow-hidden group cursor-pointer"
                        >
                            <div className="absolute inset-0">
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-60 group-hover:opacity-100"
                                />
                                <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors duration-500" />
                            </div>

                            <div className="absolute inset-0 flex flex-col justify-end p-8 bg-gradient-to-t from-black/90 via-black/20 to-transparent">
                                <h3 className="text-2xl font-bold translate-y-2 group-hover:translate-y-0 transition-transform duration-300">{item.title}</h3>
                                <p className="text-gray-300 text-sm opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 delay-75">
                                    {item.desc}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>
        </Layout>
    );
}
