import { useState } from 'react';
import type { FormEvent } from 'react';
import { Button } from './ui/Button';

export function ContactForm() {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        // Custom validations
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setStatus('error');
            setErrorMessage('Please enter a valid email address.');
            return;
        }

        setStatus('loading');
        setErrorMessage('');

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                setStatus('success');
                setFormData({ name: '', email: '', message: '' }); // Reset form
            } else {
                setStatus('error');
                setErrorMessage(data.error || 'Something went wrong.');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            setStatus('error');
            setErrorMessage('Could not connect to the server. Please check your connection.');
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        if (name === 'name') {
            // Only allow characters and single spaces. No leading/multiple spaces or numbers.
            const nameValue = value.replace(/[^a-zA-Z\s]/g, '').replace(/\s{2,}/g, ' ');
            setFormData({ ...formData, [name]: nameValue });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Name</label>
                <input
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    type="text"
                    className="w-full bg-black/50 border border-white/20 p-3 text-white focus:outline-none focus:border-white transition-colors"
                    placeholder="John Doe"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
                <input
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    type="email"
                    className="w-full bg-black/50 border border-white/20 p-3 text-white focus:outline-none focus:border-white transition-colors"
                    placeholder="john@example.com"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Message</label>
                <textarea
                    name="message"
                    required
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                    className="w-full bg-black/50 border border-white/20 p-3 text-white focus:outline-none focus:border-white transition-colors resize-none"
                    placeholder="Tell us about your project..."
                />
            </div>

            {status === 'success' && (
                <div className="text-green-400 text-sm font-medium p-3 bg-green-500/10 border border-green-500/20 rounded">
                    Your message has been sent successfully!
                </div>
            )}

            {status === 'error' && (
                <div className="text-red-400 text-sm font-medium p-3 bg-red-500/10 border border-red-500/20 rounded">
                    {errorMessage}
                </div>
            )}

            <Button disabled={status === 'loading'} size="lg" className="w-full mt-4">
                {status === 'loading' ? 'Sending...' : 'Send Message'}
            </Button>
        </form>
    );
}
