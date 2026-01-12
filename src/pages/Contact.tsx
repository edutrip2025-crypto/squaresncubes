import { Layout } from '../components/layout/Layout';
import { motion } from 'framer-motion';
import { ContactForm } from '../components/ContactForm';

export function Contact() {
    return (
        <Layout>
            <section className="min-h-screen py-20 px-6 md:px-12 flex flex-col md:flex-row gap-16">
                <div className="flex-1">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-6xl font-bold mb-8"
                    >
                        Let's start a project.
                    </motion.h1>
                    <p className="text-xl text-gray-400 mb-12">
                        Ready to transform your space? Get in touch with us.
                    </p>

                    <div className="space-y-8 text-lg">
                        <div>
                            <h3 className="font-bold text-white mb-2">Office</h3>
                            <p className="text-gray-400">SquaresNCubes, 10th floor, Awfis,<br />Prestige Shantiniketan, Hoodi - ITPL Main Rd,<br />Bangalore - 560048</p>
                        </div>
                        <div>
                            <h3 className="font-bold text-white mb-2">Email</h3>
                            <a href="mailto:hello@thesquaresncubes.com" className="text-gray-400 hover:text-white transition-colors">hello@thesquaresncubes.com</a>
                        </div>
                        <div>
                            <h3 className="font-bold text-white mb-2">Phone</h3>
                            <p className="text-gray-400">+91 93479 54461</p>
                        </div>
                    </div>
                </div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex-1 bg-white/5 p-8 md:p-12 rounded-sm border border-white/10"
                >
                    <ContactForm />
                </motion.div>
            </section>
        </Layout>
    );
}
