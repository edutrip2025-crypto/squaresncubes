import { Button } from './ui/Button';

export function ContactForm() {
    return (
        <form className="flex flex-col gap-6">
            <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Name</label>
                <input type="text" className="w-full bg-black/50 border border-white/20 p-3 text-white focus:outline-none focus:border-white transition-colors" placeholder="John Doe" />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
                <input type="email" className="w-full bg-black/50 border border-white/20 p-3 text-white focus:outline-none focus:border-white transition-colors" placeholder="john@example.com" />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Message</label>
                <textarea rows={5} className="w-full bg-black/50 border border-white/20 p-3 text-white focus:outline-none focus:border-white transition-colors resize-none" placeholder="Tell us about your project..." />
            </div>
            <Button size="lg" className="w-full mt-4">Send Message</Button>
        </form>
    );
}
