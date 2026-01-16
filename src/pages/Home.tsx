import { Layout } from '../components/layout/Layout';
import { motion, AnimatePresence } from 'framer-motion';
import { CubeScene } from '../components/3d/CubeScene';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, X } from 'lucide-react';
import { getProjectsByCategory } from '../lib/projectData';

export function Home() {
    const navigate = useNavigate();
    const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

    const featuredCategories = [
        { title: "Architectural", categoryId: "Architectural", image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800", desc: "Form follows function" },
        { title: "Fluid Structures", categoryId: "Fluid Structures", image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=800", desc: "Organic shapes" },
        { title: "Interior Designs", categoryId: "Interior Designs", image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=800", desc: "Living spaces" },
        { title: "Floor Plans & MEP", categoryId: "Floor Plans & MEP", image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=800", desc: "Technical precision" }
    ];

    const handleCategoryClick = (categoryId: string) => {
        setExpandedCategory(categoryId);
    };

    const handleProjectClick = (projectId: string) => {
        navigate(`/portfolio?project=${projectId}`);
    };

    const getCategoryProjects = (categoryId: string) => {
        const projects = getProjectsByCategory(categoryId);
        return projects.slice(0, 4); // Take top 4
    };

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

            <section className="py-20 px-6 md:px-12 relative">
                <motion.h2
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-3xl font-bold mb-12 border-l-4 border-white pl-4"
                >
                    Featured Projects
                </motion.h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {featuredCategories.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            whileHover={{ y: -10 }}
                            onClick={() => handleCategoryClick(item.categoryId)}
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

                {/* Expanded Category Modal */}
                <AnimatePresence>
                    {expandedCategory && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-50 flex items-center justify-end bg-black/60 backdrop-blur-sm"
                            onClick={() => setExpandedCategory(null)}
                        >
                            <motion.div
                                initial={{ x: '100%' }}
                                animate={{ x: 0 }}
                                exit={{ x: '100%' }}
                                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                                onClick={(e) => e.stopPropagation()}
                                className="h-full w-full md:w-[500px] bg-zinc-900 border-l border-white/10 p-8 overflow-y-auto shadow-2xl"
                            >
                                <div className="flex justify-between items-center mb-8">
                                    <h3 className="text-3xl font-bold text-white">{expandedCategory}</h3>
                                    <button onClick={() => setExpandedCategory(null)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>

                                <div className="space-y-6">
                                    {getCategoryProjects(expandedCategory).map((project: any) => (
                                        <motion.div
                                            key={project.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="group cursor-pointer relative overflow-hidden rounded-lg aspect-video border border-white/5 hover:border-white/20 transition-colors"
                                            onClick={() => handleProjectClick(project.id)}
                                        >
                                            <img
                                                src={project.image || project.thumbnail}
                                                alt={project.title}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-80 group-hover:opacity-100"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent p-4 flex flex-col justify-end">
                                                <h4 className="text-xl font-bold text-white">{project.title}</h4>
                                                <div className="flex items-center gap-2 text-sm text-yellow-400 mt-1 opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
                                                    View Project <ArrowRight className="w-4 h-4" />
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                    {getCategoryProjects(expandedCategory).length === 0 && (
                                        <p className="text-gray-400">No projects found in this category.</p>
                                    )}
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

            </section>

            <section className="py-20 px-6 md:px-12 bg-black/30">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="max-w-4xl mx-auto"
                >
                    <h2 className="text-3xl font-bold mb-8 text-center">Experience SquaresNCubes</h2>
                    <div className="aspect-video w-full rounded-lg overflow-hidden border border-white/10 shadow-2xl">
                        <iframe
                            width="100%"
                            height="100%"
                            src="https://www.youtube.com/embed/kLfOed3kp_8"
                            title="SquaresNCubes Video"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="w-full h-full"
                        ></iframe>
                    </div>
                </motion.div>
            </section>
        </Layout>
    );
}
