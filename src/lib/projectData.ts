import descText from '../assets/desc.txt?raw';

// Helper to parse the description text
const parseDescText = (text: string) => {
    const normalizedText = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    const blocks = normalizedText.split(/Project Name\s*:/i);
    const projectsMap: Record<string, any> = {};

    for (const block of blocks) {
        if (!block.trim()) continue;

        const lines = block.split('\n');
        const projectName = lines[0].trim();
        if (!projectName) continue;

        const blockText = lines.slice(1).join('\n');

        const descMatch = blockText.match(/Description\s*:\s*([\s\S]*?)(?=Project Type\s*:|$)/i);
        const typeMatch = blockText.match(/Project Type\s*:\s*([\s\S]*?)(?=Built-up Area\s*:|$)/i);
        const areaMatch = blockText.match(/Built-up Area\s*:\s*([\s\S]*?)(?=Location\s*:|$)/i);
        const locMatch = blockText.match(/Location\s*:\s*([\s\S]*?)(?=Floors\s*:|$)/i);
        const floorsMatch = blockText.match(/Floors\s*:\s*([\s\S]*?)(?=$)/i);

        const normalizedKey = projectName.toLowerCase().trim().replace(/accommodation/g, 'accomodation');
        projectsMap[normalizedKey] = {
            description: descMatch ? descMatch[1].trim() : '',
            projectType: typeMatch ? typeMatch[1].trim() : '',
            builtUpArea: areaMatch ? areaMatch[1].trim() : '',
            location: locMatch ? locMatch[1].trim() : '',
            floors: floorsMatch ? floorsMatch[1].trim() : ''
        };
    }

    return projectsMap;
};

const projectDetailsMap = parseDescText(descText);
console.log('SquaresNCubes: Parsed projectDetailsMap:', projectDetailsMap);

// Helper to process project files
const processProjects = (files: Record<string, any>, category: string, defaultImageSize: string = 'md:col-span-1 md:row-span-1') => {
    const result = Object.entries(files).reduce((acc, [path, url]) => {
        const parts = path.split('/');
        const folderName = parts[parts.length - 2];
        const fileName = parts[parts.length - 1];

        if (!acc[folderName]) {
            const lookupKey = folderName.toLowerCase().replace(/accommodation/g, 'accomodation');
            const details = projectDetailsMap[lookupKey] || {};
            acc[folderName] = {
                id: folderName.toLowerCase().replace(/\s+/g, '-'),
                title: folderName,
                category: category,
                image: url as string, // Default cover is the first image found
                size: defaultImageSize,
                description: details.description || '',
                projectType: details.projectType || '',
                builtUpArea: details.builtUpArea || '',
                location: details.location || '',
                floors: details.floors || '',
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

    console.log(`SquaresNCubes: Processed ${category} projects:`, Object.values(result));
    return result;
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
