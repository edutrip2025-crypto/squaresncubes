import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { 
    Home as HomeIcon, 
    Ruler, 
    MapPin, 
    Layers, 
    Grid, 
    Calendar, 
    ChevronLeft, 
    ChevronRight, 
    Maximize2, 
    Compass, 
    Box, 
    PenTool, 
    FileText, 
    Trees, 
    Zap, 
    X,
    ArrowRight
} from 'lucide-react';
import { getProjectsBySector } from '../lib/projectData';

// Helper function to dynamically enrich project data with realistic metadata & icons
const enrichProject = (proj: any, sector: 'Residential' | 'Commercial') => {
    if (!proj) return null;
    
    const title = proj.title || "Untitled Project";
    
    // Generate stable hash code based on title to keep metrics persistent
    const hash = title.split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0);
    
    const areas = ["3,800 Sq. Ft.", "4,500 Sq. Ft.", "5,200 Sq. Ft.", "6,100 Sq. Ft.", "2,900 Sq. Ft."];
    const plots = ["350 Sq. Yards", "450 Sq. Yards", "500 Sq. Yards", "600 Sq. Yards", "300 Sq. Yards"];
    const floors = ["G+1", "G+2", "G+1", "Penthouse G+2", "G+1"];
    const years = ["2023", "2024", "2023", "2024", "2025"];
    
    const area = areas[hash % areas.length];
    const plot = plots[hash % plots.length];
    const floor = floors[hash % floors.length];
    const year = years[hash % years.length];
    const location = hash % 2 === 0 ? "Hyderabad, India" : "Bangalore, India";

    const services = sector === 'Residential' 
        ? [
            { name: "Architecture Design", icon: Compass },
            { name: "3D Visualization", icon: Box },
            { name: "Interior Design", icon: PenTool },
            { name: "Working Drawings", icon: FileText },
            { name: "Landscape Design", icon: Trees },
            { name: "MEP Planning", icon: Zap }
          ]
        : [
            { name: "Architecture Design", icon: Compass },
            { name: "3D Visualization", icon: Box },
            { name: "Space Optimization", icon: Grid },
            { name: "MEP Design", icon: Zap },
            { name: "Project Administration", icon: Layers }
          ];

    // Build files list
    const images = (proj.files && proj.files.length > 0)
        ? proj.files.map((file: any) => ({ name: file.name, url: file.url }))
        : [{ name: title, url: proj.image || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200" }];

    return {
        id: proj.id,
        title: title,
        category: proj.category || sector,
        image: proj.image || images[0].url,
        description: proj.description || `A premium ${sector.toLowerCase()} design concept that merges modern aesthetic elements with state-of-the-art spatial functionality, custom built by SquaresNCubes.`,
        overview: proj.overview || `This ${sector.toLowerCase()} project showcases cutting-edge architectural and interior layouts. Focused on delivering maximum lighting, natural cross-ventilation, and highly optimized space usage, this project blends premium materials with minimalist forms.`,
        metadata: [
            { label: "Project Type", value: sector, icon: HomeIcon },
            { label: "Built-up Area", value: area, icon: Ruler },
            { label: "Location", value: location, icon: MapPin },
            { label: "Floors", value: floor, icon: Layers },
            { label: "Plot Area", value: plot, icon: Grid },
            { label: "Year", value: year, icon: Calendar }
        ],
        services: services,
        files: images
    };
};

// Premium Mockup Projects
const mockCourtyardVilla = {
    id: "modern-courtyard-villa",
    title: "Modern Courtyard Villa",
    category: "Residential",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200",
    description: "A serene courtyard villa designed to bring natural light, ventilation and a seamless connection between indoor and outdoor spaces.",
    overview: "This modern courtyard villa is designed around a central open-to-sky courtyard that brings in natural light and cross ventilation to all major spaces. The design blends minimal architecture with warm materials and lush landscaping to create a calm and timeless living experience.",
    metadata: [
        { label: "Project Type", value: "Residential", icon: HomeIcon },
        { label: "Built-up Area", value: "4,250 Sq. Ft.", icon: Ruler },
        { label: "Location", value: "Hyderabad, India", icon: MapPin },
        { label: "Floors", value: "G+1", icon: Layers },
        { label: "Plot Area", value: "420 Sq. Yards", icon: Grid },
        { label: "Year", value: "2024", icon: Calendar }
    ],
    services: [
        { name: "Architecture Design", icon: Compass },
        { name: "3D Visualization", icon: Box },
        { name: "Interior Design", icon: PenTool },
        { name: "Working Drawings", icon: FileText },
        { name: "Landscape Design", icon: Trees },
        { name: "MEP Planning", icon: Zap }
    ],
    files: [
        { name: "Front Elevation", url: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&q=80&w=1200" },
        { name: "Side Elevation", url: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=1200" },
        { name: "Rear Elevation", url: "https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&q=80&w=1200" },
        { name: "Night View", url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1200" },
        { name: "Entry View", url: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=1200" },
        { name: "Courtyard Garden", url: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&q=80&w=1200" },
        { name: "Poolside Lounge", url: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=1200" }
    ]
};

const mockCommercialHub = {
    id: "modern-commercial-hub",
    title: "Modern Commercial Hub",
    category: "Commercial",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1200",
    description: "An iconic sustainable corporate office building featuring a smart double-skin facade and landscaped terrace workspace decks.",
    overview: "This next-generation commercial building is optimized for energy efficiency and flexible working patterns. Using carbon-neutral structures, solar glass paneling, and interior green atriums, it sets a new benchmark in urban corporate office spaces.",
    metadata: [
        { label: "Project Type", value: "Commercial", icon: HomeIcon },
        { label: "Built-up Area", value: "85,000 Sq. Ft.", icon: Ruler },
        { label: "Location", value: "Bangalore, India", icon: MapPin },
        { label: "Floors", value: "G+8", icon: Layers },
        { label: "Plot Area", value: "1,200 Sq. Yards", icon: Grid },
        { label: "Year", value: "2025", icon: Calendar }
    ],
    services: [
        { name: "Architecture Design", icon: Compass },
        { name: "3D Visualization", icon: Box },
        { name: "Space Optimization", icon: Grid },
        { name: "MEP Design", icon: Zap },
        { name: "Project Administration", icon: Layers }
    ],
    files: [
        { name: "Façade Rendering", url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1200" },
        { name: "Workspace Atrium", url: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200" },
        { name: "Terrace Garden Office", url: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=1200" },
        { name: "Entrance Lobby", url: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=1200" }
    ]
};

export function Portfolio2() {
    const navigate = useNavigate();
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    // Fetch projects from asset helper
    const residentialRaw = getProjectsBySector('Residential');
    const commercialRaw = getProjectsBySector('Commercial');

    // Create complete projects lists
    const residentialProjects = [
        mockCourtyardVilla,
        ...residentialRaw.filter(p => p.id !== 'modern-courtyard-villa').map(p => enrichProject(p, 'Residential'))
    ].filter(Boolean) as any[];

    const commercialProjects = [
        mockCommercialHub,
        ...commercialRaw.filter(p => p.id !== 'modern-commercial-hub').map(p => enrichProject(p, 'Commercial'))
    ].filter(Boolean) as any[];

    // Sector State ('Residential' | 'Commercial')
    const [activeSector, setActiveSector] = useState<'Residential' | 'Commercial'>('Residential');
    
    // Active project list
    const currentProjects = activeSector === 'Residential' ? residentialProjects : commercialProjects;

    // Active project ID
    const [activeProjectId, setActiveProjectId] = useState(residentialProjects[0].id);

    // Current active project object
    const activeProject = currentProjects.find(p => p.id === activeProjectId) || currentProjects[0];

    // Carousel Image State (within active project files)
    const [carouselIndex, setCarouselIndex] = useState(0);
    
    // Lightbox / Zoom Overlay
    const [lightboxImage, setLightboxImage] = useState<string | null>(null);

    // Card 3D tilt effects
    const cardX = useMotionValue(0.5);
    const cardY = useMotionValue(0.5);
    
    const cardXSpring = useSpring(cardX, { stiffness: 150, damping: 20 });
    const cardYSpring = useSpring(cardY, { stiffness: 150, damping: 20 });
    
    const cardRotateX = useTransform(cardYSpring, [0, 1], [6, -6]);
    const cardRotateY = useTransform(cardXSpring, [0, 1], [-6, 6]);

    const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        
        cardX.set(mouseX / width);
        cardY.set(mouseY / height);
    };

    const handleCardMouseLeave = () => {
        cardX.set(0.5);
        cardY.set(0.5);
    };

    // Safe index bounds checking
    useEffect(() => {
        setCarouselIndex(0);
    }, [activeProjectId]);

    // Handle next/prev controls in main slideshow
    const handlePrev = () => {
        setCarouselIndex(prev => (prev === 0 ? activeProject.files.length - 1 : prev - 1));
    };

    const handleNext = () => {
        setCarouselIndex(prev => (prev === activeProject.files.length - 1 ? 0 : prev + 1));
    };

    // Horizontal Scroll Buttons Logic
    const scrollLeft = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: -320, behavior: 'smooth' });
        }
    };

    const scrollRight = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: 320, behavior: 'smooth' });
        }
    };

    const handleSectorChange = (sector: 'Residential' | 'Commercial') => {
        setActiveSector(sector);
        const defaultProj = sector === 'Residential' ? residentialProjects[0] : commercialProjects[0];
        setActiveProjectId(defaultProj.id);
        setCarouselIndex(0);
    };

    const formattedIndex = String(carouselIndex + 1).padStart(2, '0');
    const formattedTotal = String(activeProject.files.length).padStart(2, '0');

    return (
        <Layout>
            {/* Inline CSS to cleanly hide scrollbar across browsers */}
            <style dangerouslySetInnerHTML={{__html: `
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .no-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}} />

            <div className="bg-[#0b0b0b] text-[#f5f5f5] min-h-screen px-6 py-6 md:px-16 md:py-10 max-w-[1600px] mx-auto relative overflow-hidden">
                
                {/* Animated geometric background elements */}
                <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-40">
                    <motion.div
                        animate={{
                            x: [0, 80, -40, 0],
                            y: [0, -100, 50, 0],
                            scale: [1, 1.2, 0.9, 1],
                        }}
                        transition={{
                            duration: 25,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        className="absolute top-[10%] left-[20%] w-[500px] h-[500px] rounded-full bg-[#c5a880]/15 filter blur-[100px]"
                    />
                    <motion.div
                        animate={{
                            x: [0, -60, 80, 0],
                            y: [0, 100, -50, 0],
                            scale: [1, 0.9, 1.1, 1],
                        }}
                        transition={{
                            duration: 30,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        className="absolute bottom-[20%] right-[15%] w-[450px] h-[450px] rounded-full bg-yellow-500/5 filter blur-[90px]"
                    />
                    {/* Abstract rotating line wheel */}
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 180, repeat: Infinity, ease: "linear" }}
                        className="absolute top-[5%] right-[-5%] w-[700px] h-[700px] border border-white/[0.015] rounded-full flex items-center justify-center"
                    >
                        <div className="w-[600px] h-[600px] border border-dashed border-white/[0.01] rounded-full flex items-center justify-center">
                            <div className="w-[450px] h-[450px] border border-white/[0.005] rounded-full" />
                        </div>
                    </motion.div>
                </div>

                <div className="relative z-10">
                    {/* Dynamic Breadcrumbs */}
                <div className="text-xs uppercase tracking-widest text-zinc-500 mb-8 flex flex-wrap items-center gap-2 font-mono">
                    <span 
                        onClick={() => navigate('/')} 
                        className="hover:text-white cursor-pointer transition-colors"
                    >
                        Home
                    </span>
                    <span className="text-zinc-700 select-none">&gt;</span>
                    <span 
                        onClick={() => window.location.reload()} 
                        className="hover:text-white cursor-pointer transition-colors"
                    >
                        Portfolio
                    </span>
                    <span className="text-zinc-700 select-none">&gt;</span>
                    <span 
                        onClick={() => handleSectorChange(activeSector)}
                        className="hover:text-white cursor-pointer transition-colors"
                    >
                        {activeSector}
                    </span>
                    <span className="text-zinc-700 select-none">&gt;</span>
                    <span className="text-[#c5a880] font-medium">
                        {activeProject.title}
                    </span>
                </div>

                {/* Hero / Showcase Section */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16 items-stretch">
                    
                    {/* Left Column: Big Image Slider */}
                    <div className="lg:col-span-8 flex flex-col relative aspect-[16/10] bg-zinc-950 rounded-xl overflow-hidden border border-zinc-900 shadow-2xl group">
                        <AnimatePresence mode="wait">
                            <motion.img
                                key={carouselIndex + '-' + activeProjectId}
                                src={activeProject.files[carouselIndex]?.url}
                                alt={activeProject.files[carouselIndex]?.name}
                                className="w-full h-full object-cover"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.5 }}
                            />
                        </AnimatePresence>

                        {/* Slide Overlay Details */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

                        {/* Controls (Bottom Left: slide counter, Bottom Right: arrows + zoom) */}
                        <div className="absolute bottom-6 left-6 right-6 flex justify-between items-center z-20">
                            {/* Slide Counter */}
                            <div className="bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-zinc-800/80 font-mono text-sm tracking-widest text-zinc-300">
                                <span className="text-white font-bold">{formattedIndex}</span> / {formattedTotal}
                            </div>

                            {/* Navigation & Fullscreen Buttons */}
                            <div className="flex items-center gap-3">
                                <button 
                                    onClick={handlePrev}
                                    className="w-10 h-10 bg-black/60 hover:bg-[#c5a880] hover:text-black hover:border-[#c5a880] backdrop-blur-md rounded-full border border-zinc-800/80 flex items-center justify-center transition-all duration-300 text-white"
                                >
                                    <ChevronLeft size={20} />
                                </button>
                                <button 
                                    onClick={handleNext}
                                    className="w-10 h-10 bg-black/60 hover:bg-[#c5a880] hover:text-black hover:border-[#c5a880] backdrop-blur-md rounded-full border border-zinc-800/80 flex items-center justify-center transition-all duration-300 text-white"
                                >
                                    <ChevronRight size={20} />
                                </button>
                                <button 
                                    onClick={() => setLightboxImage(activeProject.files[carouselIndex]?.url)}
                                    className="w-10 h-10 bg-black/60 hover:bg-[#c5a880] hover:text-black hover:border-[#c5a880] backdrop-blur-md rounded-full border border-zinc-800/80 flex items-center justify-center transition-all duration-300 text-white"
                                >
                                    <Maximize2 size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                    {/* Right Column: Project Summary & Metadata */}
                    <div 
                        className="perspective-[1000px] lg:col-span-4 flex flex-col justify-start"
                        style={{ perspective: "1000px" }}
                    >
                        <motion.div
                            onMouseMove={handleCardMouseMove}
                            onMouseLeave={handleCardMouseLeave}
                            style={{
                                rotateX: cardRotateX,
                                rotateY: cardRotateY,
                                transformStyle: "preserve-3d",
                            }}
                            transition={{ duration: 0.3 }}
                            className="w-full h-full p-6 md:p-8 bg-[#121212]/30 backdrop-blur-2xl border border-white/[0.08] rounded-xl relative shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] flex flex-col justify-between"
                        >
                            <div style={{ transform: "translateZ(30px)" }} className="flex flex-col justify-between h-full gap-8">
                                <div>
                                    {/* Title */}
                                    <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white mb-3">
                                        {activeProject.title}
                                    </h1>
                                    <p className="text-zinc-400 text-xs leading-relaxed mb-6 border-b border-white/5 pb-4">
                                        {activeProject.description}
                                    </p>

                                    {/* Metadata Grid */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-4 mb-6">
                                        {activeProject.metadata
                                            .filter((meta: any) => ["Project Type", "Built-up Area", "Location", "Floors"].includes(meta.label))
                                            .map((meta: any, idx: number) => {
                                                const IconComponent = meta.icon;
                                                return (
                                                    <div key={idx} className="flex gap-2.5 items-start">
                                                        <div className="p-1.5 rounded bg-zinc-950/60 border border-white/5 text-[#c5a880]">
                                                            <IconComponent size={16} />
                                                        </div>
                                                        <div>
                                                            <p className="text-[9px] uppercase tracking-wider text-zinc-500 font-semibold">{meta.label}</p>
                                                            <p className="text-xs font-bold text-zinc-200 mt-0.5">{meta.value}</p>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                    </div>
                                </div>

                                {/* Active Project Thumbnails Row inside Card */}
                                <div className="border-t border-white/5 pt-4 mt-auto">
                                    <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold mb-3 font-mono">
                                        Project Media ({activeProject.files.length})
                                    </p>
                                    <div 
                                        className="flex gap-2 overflow-x-auto pb-1.5 no-scrollbar scroll-smooth snap-x"
                                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                                    >
                                        {activeProject.files.map((file: any, idx: number) => (
                                            <div
                                                key={idx}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setCarouselIndex(idx);
                                                }}
                                                className={`flex-shrink-0 cursor-pointer w-[72px] aspect-[4/3] rounded-md overflow-hidden border transition-all duration-300 snap-center ${
                                                    carouselIndex === idx
                                                        ? "border-[#c5a880] ring-1 ring-[#c5a880]/30 scale-105 shadow-md shadow-[#c5a880]/5"
                                                        : "border-white/10 opacity-60 hover:opacity-100 hover:border-white/20"
                                                }`}
                                            >
                                                <img 
                                                    src={file.url} 
                                                    alt={file.name} 
                                                    className="w-full h-full object-cover" 
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Project Overview Tab Section */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16 items-start border-t border-zinc-900 pt-16">
                    {/* Left side: description */}
                    <div className="lg:col-span-4">
                        <h2 className="text-xl font-bold tracking-tight text-white uppercase mb-4 border-l-2 border-[#c5a880] pl-3">
                            Project Overview
                        </h2>
                        <p className="text-zinc-400 text-sm leading-relaxed max-w-md">
                            {activeProject.overview}
                        </p>
                    </div>

                    {/* Right side: tabs list & projects horizontal carousel */}
                    <div className="lg:col-span-8 flex flex-col relative">
                        {/* Tabs Navigation */}
                        <div className="flex gap-8 mb-6 border-b border-zinc-900 pb-3">
                            <button
                                onClick={() => handleSectorChange('Residential')}
                                className={`text-xs uppercase tracking-wider font-bold transition-all relative pb-3 ${
                                    activeSector === 'Residential'
                                        ? "text-[#c5a880] font-black"
                                        : "text-zinc-500 hover:text-zinc-300"
                                }`}
                            >
                                Residential Projects
                                {activeSector === 'Residential' && (
                                    <motion.div
                                        layoutId="sector-tab-indicator"
                                        className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#c5a880]"
                                    />
                                )}
                            </button>
                            <button
                                onClick={() => handleSectorChange('Commercial')}
                                className={`text-xs uppercase tracking-wider font-bold transition-all relative pb-3 ${
                                    activeSector === 'Commercial'
                                        ? "text-[#c5a880] font-black"
                                        : "text-zinc-500 hover:text-zinc-300"
                                }`}
                            >
                                Commercial Projects
                                {activeSector === 'Commercial' && (
                                    <motion.div
                                        layoutId="sector-tab-indicator"
                                        className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#c5a880]"
                                    />
                                )}
                            </button>
                        </div>

                        {/* Projects Horizontal Slider Container */}
                        <div className="relative group/scroll flex items-center">
                            {/* Scroll Left Button */}
                            <button
                                onClick={scrollLeft}
                                className="absolute -left-4 z-10 w-9 h-9 bg-zinc-950/80 hover:bg-[#c5a880] hover:text-black border border-zinc-800 rounded-full flex items-center justify-center transition-all opacity-0 group-hover/scroll:opacity-100 shadow-lg text-white"
                            >
                                <ChevronLeft size={16} />
                            </button>

                            {/* Scroll Container */}
                            <div
                                ref={scrollContainerRef}
                                className="flex gap-4 overflow-x-auto py-3 scroll-smooth w-full no-scrollbar"
                            >
                                {currentProjects.map((proj, idx) => (
                                    <motion.div
                                        key={proj.id}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.04 }}
                                        onClick={() => {
                                            setActiveProjectId(proj.id);
                                        }}
                                        className={`flex-shrink-0 cursor-pointer rounded-lg overflow-hidden border transition-all duration-300 w-56 aspect-[4/3] relative group ${
                                            activeProjectId === proj.id
                                                ? "border-[#c5a880] scale-102 ring-1 ring-[#c5a880]/30 shadow-lg shadow-[#c5a880]/5"
                                                : "border-zinc-900 hover:border-zinc-700"
                                        }`}
                                    >
                                        <img 
                                            src={proj.image} 
                                            alt={proj.title} 
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-transparent flex flex-col justify-end p-4">
                                            <p className="text-[9px] font-mono text-[#c5a880] uppercase tracking-widest mb-1">{proj.category}</p>
                                            <h4 className="text-xs font-bold text-white leading-snug group-hover:text-yellow-400 transition-colors truncate">{proj.title}</h4>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Scroll Right Button */}
                            <button
                                onClick={scrollRight}
                                className="absolute -right-4 z-10 w-9 h-9 bg-zinc-950/80 hover:bg-[#c5a880] hover:text-black border border-zinc-800 rounded-full flex items-center justify-center transition-all opacity-0 group-hover/scroll:opacity-100 shadow-lg text-white"
                            >
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Lightbox / Zoom-in Modal Overlay */}
                <AnimatePresence>
                    {lightboxImage && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[60] bg-black/95 flex items-center justify-center p-4 backdrop-blur-sm"
                            onClick={() => setLightboxImage(null)}
                        >
                            <button
                                className="absolute top-6 right-6 text-white bg-zinc-900 border border-zinc-800 hover:bg-white hover:text-black p-2.5 rounded-full transition-all duration-300 z-50 shadow-xl"
                                onClick={() => setLightboxImage(null)}
                            >
                                <X size={24} />
                            </button>

                            <div className="w-full h-full flex flex-col items-center justify-center p-4 md:p-12 pointer-events-none">
                                <motion.img
                                    initial={{ scale: 0.95 }}
                                    animate={{ scale: 1 }}
                                    exit={{ scale: 0.95 }}
                                    src={lightboxImage}
                                    alt="Zoomed preview"
                                    className="max-w-full max-h-full object-contain rounded-lg shadow-2xl pointer-events-auto border border-zinc-900"
                                    onClick={(e) => e.stopPropagation()}
                                />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
                </div>
            </div>
        </Layout>
    );
}
