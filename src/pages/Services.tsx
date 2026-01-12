import { Layout } from '../components/layout/Layout';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const services = [
    {
        title: 'Architectural Design',
        description: 'Comprehensive architectural services from concept to construction administration. We focus on sustainable, functional, and aesthetic precision.',
        features: ['Concept Development', '3D Visualization', 'Sustainability Planning', 'Construction Docs']
    },
    {
        title: 'Interior Design',
        description: 'Curating spaces that reflect your identity. We blend textures, colors, and light to create immersive environments.',
        features: ['Space Planning', 'Material Selection', 'Furniture Design', 'Lighting Design']
    },
    {
        title: 'Urban Planning',
        description: 'Thinking bigger. We design master plans that integrate communities with their environment.',
        features: ['Master Planning', 'Landscape Architecture', 'Community Design']
    },
    {
        title: 'Project Management',
        description: 'Ensuring your vision is built to spec, on time, and on budget.',
        features: ['Cost Estimation', 'Contractor Coordination', 'Site Supervision']
    }
];

export function Services() {
    return (
        <Layout>
            <section className="py-20 px-6 md:px-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="mb-16"
                >
                    <h1 className="text-4xl md:text-6xl font-bold mb-6">Services</h1>
                    <p className="text-gray-400 max-w-xl text-lg">We provide end-to-end design solutions tailored to your unique needs.</p>
                </motion.div>

                <div className="grid grid-cols-1 gap-8">
                    {services.map((service, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="group border-t border-white/10 py-12 hover:bg-white/5 transition-colors px-4 md:px-8 relative"
                        >
                            <div className="flex flex-col md:flex-row md:items-start gap-6 md:gap-12">
                                <span className="text-gray-600 font-mono text-sm">0{index + 1}</span>
                                <div className="flex-1">
                                    <h2 className="text-3xl font-bold mb-4 group-hover:text-white transition-colors">{service.title}</h2>
                                    <p className="text-gray-400 max-w-2xl text-lg mb-8">{service.description}</p>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {service.features.map(feature => (
                                            <div key={feature} className="flex items-center gap-2 text-sm text-gray-500">
                                                <div className="w-1 h-1 bg-white rounded-full" />
                                                {feature}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="hidden md:flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <ArrowRight size={32} className="-rotate-45" />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>
        </Layout>
    );
}
