import { Layout } from '../components/layout/Layout';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { CubeScene } from '../components/3d/CubeScene';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, X } from 'lucide-react';
import { getProjectsBySector } from '../lib/projectData';

interface TiltCardProps {
    title: string;
    desc: string;
    image: string;
    onClick: () => void;
}

function TiltCard({ title, desc, image, onClick }: TiltCardProps) {
    const x = useMotionValue(0.5);
    const y = useMotionValue(0.5);

    const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 });
    const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 });

    const rotateX = useTransform(mouseYSpring, [0, 1], [10, -10]);
    const rotateY = useTransform(mouseXSpring, [0, 1], [-10, 10]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        
        x.set(mouseX / width);
        y.set(mouseY / height);
    };

    const handleMouseLeave = () => {
        x.set(0.5);
        y.set(0.5);
    };

    return (
        <div
            className="perspective-[1000px] w-full"
            style={{ perspective: "1000px" }}
        >
            <motion.div
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                onClick={onClick}
                style={{
                    rotateX,
                    rotateY,
                    transformStyle: "preserve-3d",
                }}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
                className="aspect-[16/10] w-full rounded-xl relative overflow-hidden group cursor-pointer border border-white/10 shadow-2xl bg-zinc-950"
            >
                {/* Background Image with Parallax */}
                <div 
                    className="absolute inset-0 transition-transform duration-700 group-hover:scale-105"
                    style={{ transform: "translateZ(-20px)" }}
                >
                    <img
                        src={image}
                        alt={title}
                        className="w-full h-full object-cover opacity-50 group-hover:opacity-80 transition-opacity duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-900/40 to-transparent" />
                </div>

                {/* Content with 3D Depth */}
                <div 
                    className="absolute inset-0 flex flex-col justify-end p-8 md:p-12"
                    style={{ transform: "translateZ(40px)" }}
                >
                    <span className="text-yellow-400 font-mono text-xs tracking-widest uppercase mb-2 opacity-80 group-hover:opacity-100 transition-opacity">
                        Explore Sector
                    </span>
                    <h3 className="text-3xl md:text-5xl font-black tracking-tight text-white mb-4 group-hover:text-yellow-400 transition-colors">
                        {title}
                    </h3>
                    <p className="text-zinc-300 text-sm md:text-base max-w-md line-clamp-3 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                        {desc}
                    </p>
                    
                    {/* Visual 3D hover helper */}
                    <div className="flex items-center gap-2 text-sm text-yellow-400 mt-6 font-semibold opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0 duration-300 delay-75">
                        View Projects <ArrowRight className="w-4 h-4" />
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

export function Home() {
    const navigate = useNavigate();
    const [expandedSector, setExpandedSector] = useState<'Residential' | 'Commercial' | null>(null);

    const sectors = [
        { 
            title: "Residential", 
            sectorId: "Residential" as const, 
            image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200", 
            desc: "Bespoke living spaces, villas, apartments, and tailored residential designs designed for comfort, harmony, and modern elegance." 
        },
        { 
            title: "Commercial", 
            sectorId: "Commercial" as const, 
            image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1200", 
            desc: "Cutting-edge corporate offices, retail spaces, restaurants, educational institutes, and sustainable commercial structures." 
        }
    ];

    const handleProjectClick = (projectId: string) => {
        navigate(`/portfolio?project=${projectId}`);
    };

    const getSectorProjects = (sector: 'Residential' | 'Commercial') => {
        const projects = getProjectsBySector(sector);
        return projects.slice(0, 6); // Top 6 projects
    };

    return (
        <Layout>
            {/* Hero Section */}
            <section className="h-[80vh] flex items-center justify-center relative overflow-hidden">
                <CubeScene />
                <div className="absolute inset-0 z-0 bg-gradient-to-b from-black/50 via-transparent to-black" />

                <div className="relative z-10 text-center px-4">
                    <motion.h1
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-3xl sm:text-5xl md:text-8xl font-bold tracking-tighter mb-6"
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

            {/* Sectors (Residential & Commercial) Section */}
            <section className="py-20 px-6 md:px-12 relative max-w-7xl mx-auto w-full">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="mb-12 border-l-4 border-white pl-4"
                >
                    <h2 className="text-3xl font-bold tracking-tight text-white uppercase">Sectors</h2>
                    <p className="text-gray-400 text-sm mt-1">Innovative architectural design across diverse spaces and environments.</p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {sectors.map((sector, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.15 }}
                        >
                            <TiltCard
                                title={sector.title}
                                desc={sector.desc}
                                image={sector.image}
                                onClick={() => setExpandedSector(sector.sectorId)}
                            />
                        </motion.div>
                    ))}
                </div>

                {/* Expanded Sector Modal */}
                <AnimatePresence>
                    {expandedSector && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-50 flex items-center justify-end bg-black/60 backdrop-blur-sm"
                            onClick={() => setExpandedSector(null)}
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
                                    <h3 className="text-3xl font-bold text-white">{expandedSector} Projects</h3>
                                    <button onClick={() => setExpandedSector(null)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>

                                <div className="space-y-6">
                                    {getSectorProjects(expandedSector).map((project: any) => (
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
                                    {getSectorProjects(expandedSector).length === 0 && (
                                        <p className="text-gray-400">No projects found in this sector.</p>
                                    )}
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </section>
        </Layout>
    );
}
