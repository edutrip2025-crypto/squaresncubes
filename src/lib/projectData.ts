
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

// Helper for single image projects (Architecture, Fluid Arch)
const processSingleImageProjects = (files: Record<string, any>, category: string) => {
    return Object.entries(files).map(([path, url], index) => {
        const fileName = path.split('/').pop() || `Project ${index}`;
        const title = decodeURIComponent(fileName).replace(/\.(png|jpg|jpeg)$/i, '');

        return {
            id: `${category}-${index}`,
            title: title,
            category: category,
            image: url as string,
            size: 'md:col-span-1 md:row-span-1', // Default size
            files: [{
                name: title,
                url: url as string,
                type: 'image'
            }]
        };
    });
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

// Load Architecture files
const architectureFiles = import.meta.glob('../assets/portfolio/architecture/*.(png|jpg|jpeg)', {
    eager: true,
    query: '?url',
    import: 'default'
});

// Load Fluid Architecture files
const fluidArchFiles = import.meta.glob('../assets/portfolio/fluid_arch/*.(png|jpg|jpeg)', {
    eager: true,
    query: '?url',
    import: 'default'
});


export const floorPlanProjects = processProjects(floorPlanFiles, 'Floor Plans & MEP');
export const interiorProjects = processProjects(interiorFiles, 'Interior Designs');
export const architectureProjects = processSingleImageProjects(architectureFiles, 'Architectural');
export const fluidArchProjects = processSingleImageProjects(fluidArchFiles, 'Fluid Structures');

export const walkthroughVideos = [
    { id: 'vid1', title: 'Apartment Design', url: 'https://www.youtube.com/watch?v=XspshIVFdLs', videoId: 'XspshIVFdLs', thumbnail: 'https://img.youtube.com/vi/XspshIVFdLs/hqdefault.jpg', category: 'Walkthrough videos' },
    { id: 'vid2', title: 'Bedroom Design', url: 'https://www.youtube.com/watch?v=EmK34Q297xY', videoId: 'EmK34Q297xY', thumbnail: 'https://img.youtube.com/vi/EmK34Q297xY/hqdefault.jpg', category: 'Walkthrough videos' },
    { id: 'vid3', title: 'Terrace Garden', url: 'https://www.youtube.com/watch?v=9n4qfTSeg5E', videoId: '9n4qfTSeg5E', thumbnail: 'https://img.youtube.com/vi/9n4qfTSeg5E/hqdefault.jpg', category: 'Walkthrough videos' },
    { id: 'vid4', title: 'Dinning and Kitchen Design', url: 'https://www.youtube.com/watch?v=bPtgRB_MfbU', videoId: 'bPtgRB_MfbU', thumbnail: 'https://img.youtube.com/vi/bPtgRB_MfbU/hqdefault.jpg', category: 'Walkthrough videos' },
    { id: 'vid5', title: 'Spa & Saloon', url: 'https://www.youtube.com/watch?v=u3vDaliM64g', videoId: 'u3vDaliM64g', thumbnail: 'https://img.youtube.com/vi/u3vDaliM64g/hqdefault.jpg', category: 'Walkthrough videos' },
    { id: 'vid6', title: 'Minimal Spa & Salon Design', url: 'https://www.youtube.com/watch?v=eLnIUgQQujU', videoId: 'eLnIUgQQujU', thumbnail: 'https://img.youtube.com/vi/eLnIUgQQujU/hqdefault.jpg', category: 'Walkthrough videos' },
    { id: 'vid7', title: 'School Design', url: 'https://www.youtube.com/watch?v=kLfOed3kp_8', videoId: 'kLfOed3kp_8', thumbnail: 'https://img.youtube.com/vi/kLfOed3kp_8/hqdefault.jpg', category: 'Walkthrough videos' },
];

// Helper to shuffle array
export const shuffleArray = (array: any[]) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
};

export const allProjects = shuffleArray([
    ...Object.values(floorPlanProjects),
    ...Object.values(interiorProjects),
    ...architectureProjects,
    ...fluidArchProjects
]);

export const categories = ['All', 'Architectural', 'Fluid Structures', 'Interior Designs', 'Floor Plans & MEP', 'Walkthrough videos'];

export const getProjectsByCategory = (category: string) => {
    if (category === 'All') return allProjects;
    if (category === 'Walkthrough videos') return walkthroughVideos;
    return allProjects.filter((p: any) => p.category === category);
};

export const getProjectById = (id: string, category?: string) => {
    if (category === 'Walkthrough videos' || (!category && id.startsWith('vid'))) {
        return walkthroughVideos.find(p => p.id === id);
    }
    return allProjects.find((p: any) => p.id === id);
};

export const getProjectsBySector = (sector: 'Residential' | 'Commercial') => {
    const residentialKeywords = [
        'villa', 'apartment', 'duplex', 'house', 'bedroom', 'living', 'dining', 'kitchen', 'staircase', 'terrace', 'farm', 'home'
    ];

    const commercialKeywords = [
        'office', 'restaurant', 'cafe', 'spa', 'saloon', 'salon', 'showroom', 'school', 'building', 'club house', 'student', 'commercial'
    ];

    return allProjects.filter((project: any) => {
        const titleLower = (project.title || '').toLowerCase();
        const idLower = (project.id || '').toLowerCase();
        const categoryLower = (project.category || '').toLowerCase();

        const isRes = residentialKeywords.some(keyword =>
            titleLower.includes(keyword) || idLower.includes(keyword) || categoryLower.includes(keyword)
        );
        const isComm = commercialKeywords.some(keyword =>
            titleLower.includes(keyword) || idLower.includes(keyword) || categoryLower.includes(keyword)
        );

        if (sector === 'Residential') {
            return isRes || !isComm;
        } else {
            return isComm;
        }
    });
};
