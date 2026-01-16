import { Layout } from '../components/layout/Layout';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { cn } from '../lib/utils';
import { ArrowUpRight, X, Image as ImageIcon } from 'lucide-react';
import { allProjects, walkthroughVideos, categories, getProjectById } from '../lib/projectData';

export function Portfolio() {
    const [filter, setFilter] = useState('All');
    const [selectedProject, setSelectedProject] = useState<any>(null);
    const [selectedVideo, setSelectedVideo] = useState<any>(null);
    const [previewFile, setPreviewFile] = useState<any>(null);
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const projectId = searchParams.get('project');
        if (projectId) {
            const project = getProjectById(projectId);
            if (project) {
                if (project.category === 'Walkthrough videos') {
                    setSelectedVideo(project);
                } else {
                    setSelectedProject(project);
                }
            }
        }
    }, [searchParams]);


    const filteredProjects = filter === 'All'
        ? allProjects
        : filter === 'Walkthrough videos'
            ? walkthroughVideos
            : allProjects.filter((p: any) => p.category === filter);

    return (
        <Layout>
            <section className="py-20 px-6 md:px-12 min-h-screen">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="mb-16 flex flex-col md:flex-row justify-between items-end gap-6"
                >
                    <div>
                        <h1 className="text-4xl md:text-7xl font-bold mb-4">Selected<br />Works</h1>
                        <p className="text-gray-400 max-w-sm">A curation of spaces defined by light, geometry, and purpose.</p>
                    </div>

                    <div className="flex flex-wrap gap-2 md:gap-4">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setFilter(cat)}
                                className={`text-xs md:text-sm tracking-widest uppercase px-4 py-2 border rounded-full transition-all ${filter === cat
                                    ? 'bg-white text-black border-white'
                                    : 'text-gray-400 border-white/20 hover:border-white hover:text-white'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </motion.div>

                <motion.div
                    layout
                    className={`grid gap-4 ${filter === 'Walkthrough videos' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 md:grid-cols-4 auto-rows-[300px]'}`}
                >
                    <AnimatePresence mode='popLayout'>
                        {filteredProjects.map((project: any) => (
                            <motion.div
                                layout
                                key={project.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.4 }}
                                onClick={() => {
                                    if (project.category === 'Walkthrough videos') {
                                        setSelectedVideo(project);
                                    } else if (project.files) {
                                        setSelectedProject(project);
                                    }
                                }}
                                className={cn(
                                    "group relative overflow-hidden rounded-md cursor-pointer",
                                    project.size || 'aspect-video'
                                )}
                            >
                                <motion.img
                                    src={project.image || project.thumbnail}
                                    alt={project.title}
                                    className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
                                    loading="lazy"
                                />
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300" />

                                <div className="absolute inset-0 p-6 flex flex-col justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <div className="self-end bg-white/10 backdrop-blur-md p-2 rounded-full border border-white/20">
                                        <ArrowUpRight className="text-white w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-yellow-400 text-xs font-mono mb-2 uppercase tracking-wider">{project.category}</p>
                                        <h3 className="text-2xl font-bold text-white">{project.title}</h3>
                                    </div>
                                </div>
                                {project.category === 'Walkthrough videos' && (
                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                        <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 group-hover:scale-110 transition-transform">
                                            <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[20px] border-l-white border-b-[10px] border-b-transparent ml-1" />
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>

                {/* Project Details Modal */}
                <AnimatePresence>
                    {selectedProject && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
                            onClick={() => setSelectedProject(null)}
                        >
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                onClick={(e) => e.stopPropagation()}
                                className="bg-zinc-900 w-full max-w-6xl max-h-[90vh] rounded-lg overflow-hidden flex flex-col border border-white/10"
                            >
                                <div className="p-6 border-b border-white/10 flex justify-between items-center bg-zinc-900/50">
                                    <div>
                                        <h2 className="text-2xl font-bold">{selectedProject.title}</h2>
                                        <p className="text-gray-400 text-sm">{selectedProject.category}</p>
                                    </div>
                                    <button onClick={() => setSelectedProject(null)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>

                                <div className="flex-1 overflow-y-auto p-6 bg-black/20 text-white">
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {selectedProject.files?.map((file: any, index: number) => (
                                            <div key={index} className="space-y-3">
                                                <div className="aspect-[4/3] bg-zinc-800 rounded-lg overflow-hidden border border-white/5 relative group">
                                                    <div className="w-full h-full relative group cursor-pointer" onClick={() => setPreviewFile(file)}>
                                                        <img src={file.url} alt={file.name} className="w-full h-full object-cover" />
                                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                                                            <div className="bg-white text-black px-4 py-2 rounded-full font-bold text-sm flex items-center gap-2 transform translate-y-2 group-hover:translate-y-0 transition-all">
                                                                <ImageIcon className="w-4 h-4" /> View Image
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <p className="text-sm font-mono text-gray-400 truncate" title={file.name}>{file.name}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Video Modal */}
                <AnimatePresence>
                    {selectedVideo && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-md"
                            onClick={() => setSelectedVideo(null)}
                        >
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                onClick={(e) => e.stopPropagation()}
                                className="w-full max-w-5xl aspect-video bg-black rounded-lg overflow-hidden shadow-2xl border border-white/10 relative"
                            >
                                <button
                                    className="absolute top-4 right-4 text-white p-2 bg-black/50 hover:bg-white/20 rounded-full transition-colors z-10 backdrop-blur-sm"
                                    onClick={() => setSelectedVideo(null)}
                                >
                                    <X className="w-6 h-6" />
                                </button>
                                <iframe
                                    width="100%"
                                    height="100%"
                                    src={`https://www.youtube.com/embed/${selectedVideo.videoId}?autoplay=1&rel=0`}
                                    title={selectedVideo.title}
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                ></iframe>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>


                {/* Lightbox / Preview Modal */}
                <AnimatePresence>
                    {previewFile && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[60] bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm"
                            onClick={() => setPreviewFile(null)}
                        >
                            <button
                                className="absolute top-6 right-6 text-white p-2 hover:bg-white/10 rounded-full transition-colors z-50"
                                onClick={() => setPreviewFile(null)}
                            >
                                <X className="w-8 h-8" />
                            </button>

                            <div className="w-full h-full flex flex-col items-center justify-center p-4 md:p-12 pointer-events-none">
                                <img
                                    src={previewFile.url}
                                    alt={previewFile.name}
                                    className="max-w-full max-h-full object-contain rounded-lg shadow-2xl pointer-events-auto"
                                    onClick={(e) => e.stopPropagation()}
                                />
                            </div>

                            <div className="absolute bottom-6 left-0 right-0 text-center pointer-events-none">
                                <p className="text-white/70 text-sm font-mono inline-block bg-black/50 px-4 py-2 rounded-full backdrop-blur-sm">
                                    {previewFile.name}
                                </p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

            </section>
        </Layout>
    );
}
