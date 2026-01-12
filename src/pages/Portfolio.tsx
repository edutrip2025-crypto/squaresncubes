import { Layout } from '../components/layout/Layout';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { cn } from '../lib/utils';
import { ArrowUpRight, X, Image as ImageIcon } from 'lucide-react';

// Helper to process project files
const processProjects = (files: Record<string, any>, category: string, defaultImageSize: string = 'md:col-span-1 md:row-span-1') => {
    return Object.entries(files).reduce((acc, [path, url]) => {
        const parts = path.split('/');
        const folderName = parts[parts.length - 2];
        const fileName = parts[parts.length - 1];

        if (!acc[folderName]) {
            acc[folderName] = {
                id: folderName,
                title: folderName,
                category: category,
                image: url as string, // Default cover is the first image found
                size: defaultImageSize,
                files: []
            };
        }

        acc[folderName].files.push({
            name: decodeURIComponent(fileName).replace(/\.(png|jpg|jpeg)$/i, ''),
            url: url as string,
            type: 'image'
        });

        return acc;
    }, {} as Record<string, any>);
};

// Load Floor Plan files
const floorPlanFiles = import.meta.glob('../assets/portfolio/floorplans_mep/*/*.(png|jpg|jpeg)', {
    eager: true,
    query: '?url',
    import: 'default'
});

// Load Interior Design files
const interiorFiles = import.meta.glob('../assets/portfolio/interiors/*/*.(png|jpg|jpeg)', {
    eager: true,
    query: '?url',
    import: 'default'
});

const floorPlanProjects = processProjects(floorPlanFiles, 'Floor Plans & MEP');
const interiorProjects = processProjects(interiorFiles, 'Interior Designs');

const existingProjects = [
    { id: 1, title: 'Azure Skyline', category: 'Architectural', image: 'https://images.unsplash.com/photo-1600596542815-2a4d9fdd4070?auto=format&fit=crop&q=80&w=800', size: 'md:col-span-2 md:row-span-2' },
    // Removed hardcoded Interiors to prefer dynamic ones if needed, or keep them if they are distinct. 
    // Keeping them for now as they have specific data.
    { id: 3, title: 'Cube Residence', category: 'Architectural', image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=800', size: 'md:col-span-1 md:row-span-2' },
    { id: 5, title: 'Flux Museum', category: 'Fluid Structures', image: 'https://images.unsplash.com/photo-1577493340887-b7bfff550145?auto=format&fit=crop&q=80&w=800', size: 'md:col-span-2 md:row-span-1' },
    { id: 6, title: 'Neo Villa', category: 'Architectural', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800', size: 'md:col-span-1 md:row-span-1' },
    { id: 7, title: 'Zenith Tower', category: 'Fluid Structures', image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800', size: 'md:col-span-1 md:row-span-2' },
    { id: 8, title: 'Echo Pavilion', category: 'Fluid Structures', image: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=800', size: 'md:col-span-2 md:row-span-2' },
];

// Helper to shuffle array
const shuffleArray = (array: any[]) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
};

const allProjects = shuffleArray([
    ...existingProjects,
    ...Object.values(floorPlanProjects),
    ...Object.values(interiorProjects)
]);

const categories = ['All', 'Architectural', 'Fluid Structures', 'Interior Designs', 'Floor Plans & MEP'];

export function Portfolio() {
    const [filter, setFilter] = useState('All');
    const [selectedProject, setSelectedProject] = useState<any>(null);
    const [previewFile, setPreviewFile] = useState<any>(null);

    const filteredProjects = filter === 'All'
        ? allProjects
        : allProjects.filter(p => p.category === filter);

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
                    className="grid grid-cols-1 md:grid-cols-4 auto-rows-[300px] gap-4"
                >
                    <AnimatePresence>
                        {filteredProjects.map((project: any) => (
                            <motion.div
                                layout
                                key={project.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.4 }}
                                onClick={() => project.files ? setSelectedProject(project) : null}
                                className={cn(
                                    "group relative overflow-hidden rounded-md cursor-pointer",
                                    project.size
                                )}
                            >
                                <motion.img
                                    src={project.image}
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
