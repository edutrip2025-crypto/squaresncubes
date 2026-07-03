// Helper to process project files
const processProjects = (files: Record<string, any>, category: string, defaultImageSize: string = 'md:col-span-1 md:row-span-1') => {
    return Object.entries(files).reduce((acc, [path, url]) => {
        const parts = path.split('/');
        const folderName = parts[parts.length - 2];
        const fileName = parts[parts.length - 1];

        if (!acc[folderName]) {
            acc[folderName] = {
                id: folderName.toLowerCase().replace(/\s+/g, '-'),
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

// Load Residential files
const residentialFiles = import.meta.glob('../assets/Residential/*/*.(png|jpg|jpeg)', {
    eager: true,
    query: '?url',
    import: 'default'
});

const commercialFiles = import.meta.glob('../assets/Commercial/*/*.(png|jpg|jpeg)', {
    eager: true,
    query: '?url',
    import: 'default'
});

export const residentialProjects = Object.values(processProjects(residentialFiles, 'Residential'));
export const commercialProjects = Object.values(processProjects(commercialFiles, 'Commercial'));

export const allProjects = [
    ...residentialProjects,
    ...commercialProjects
];

export const categories = ['All', 'Residential', 'Commercial'];

export const getProjectsByCategory = (category: string) => {
    if (category === 'All') return allProjects;
    return allProjects.filter((p: any) => p.category === category);
};

export const getProjectById = (id: string) => {
    return allProjects.find((p: any) => p.id === id);
};

export const getProjectsBySector = (sector: 'Residential' | 'Commercial') => {
    return allProjects.filter((p: any) => p.category === sector);
};
