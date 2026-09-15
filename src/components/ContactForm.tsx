import { useState } from 'react';
import type { FormEvent } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react';

const projectTypes = ['Residential', 'Commercial', 'Hospitality', 'Other'];
const projectStages = ['Just an idea', 'Site selected', 'Design underway', 'Ready to execute'];
const timelines = ['0–3 months', '3–6 months', '6–12 months', 'Flexible'];

export function ContactForm() {
    const [step, setStep] = useState(0);
    const [formData, setFormData] = useState({ type: '', location: '', stage: '', timeline: '', name: '', email: '', message: '' });
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');

    const setField = (name: string, value: string) => setFormData((current) => ({ ...current, [name]: value }));
    const canContinue = step === 0 ? Boolean(formData.type && formData.location.trim()) : Boolean(formData.stage && formData.timeline && formData.message.trim());

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        if (step < 2) {
            if (canContinue) setStep((current) => current + 1);
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.name.trim() || !emailRegex.test(formData.email)) {
            setStatus('error');
            setErrorMessage('Please add your name and a valid email address.');
            return;
        }

        setStatus('loading');
        setErrorMessage('');
        const structuredMessage = `Project type: ${formData.type}\nLocation: ${formData.location}\nCurrent stage: ${formData.stage}\nPreferred start: ${formData.timeline}\n\nProject brief:\n${formData.message}`;

        try {
            const response = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: formData.name, email: formData.email, message: structuredMessage }) });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Something went wrong.');
            setStatus('success');
        } catch (error) {
            setStatus('error');
            setErrorMessage(error instanceof Error ? error.message : 'Could not connect. Please email us directly.');
        }
    };

    if (status === 'success') return <div className="brief-success"><span>Brief received / 01</span><h2>Thank you.</h2><p>Your project now has a starting point. We’ll continue the conversation by email.</p></div>;

    return <form onSubmit={handleSubmit} className="brief-form">
        <div className="brief-progress"><span>0{step + 1}</span><div>{[0, 1, 2].map((item) => <i key={item} className={item <= step ? 'is-active' : ''} />)}</div><small>03</small></div>
        <div className="brief-step-frame">
            {step === 0 && <div className="brief-step">
                <span className="brief-step-kicker">Begin with the essentials</span>
                <h2>What are we shaping?</h2>
                <div className="brief-choices">{projectTypes.map((type) => <button type="button" key={type} aria-pressed={formData.type === type} onClick={() => setField('type', type)}>{type}</button>)}</div>
                <label className="brief-line-field"><span>Project location</span><input value={formData.location} onChange={(event) => setField('location', event.target.value)} placeholder="City / neighbourhood" /></label>
            </div>}
            {step === 1 && <div className="brief-step">
                <span className="brief-step-kicker">Set the coordinates</span>
                <h2>Where does the idea stand?</h2>
                <div className="brief-choice-group"><span>Current stage</span><div className="brief-choices">{projectStages.map((stage) => <button type="button" key={stage} aria-pressed={formData.stage === stage} onClick={() => setField('stage', stage)}>{stage}</button>)}</div></div>
                <div className="brief-choice-group"><span>Preferred start</span><div className="brief-choices">{timelines.map((timeline) => <button type="button" key={timeline} aria-pressed={formData.timeline === timeline} onClick={() => setField('timeline', timeline)}>{timeline}</button>)}</div></div>
                <label className="brief-line-field"><span>The brief</span><textarea value={formData.message} onChange={(event) => setField('message', event.target.value)} rows={3} placeholder="What should this place make possible?" /></label>
            </div>}
            {step === 2 && <div className="brief-step">
                <span className="brief-step-kicker">One final detail</span>
                <h2>How should we reach you?</h2>
                <label className="brief-line-field"><span>Your name</span><input autoFocus required value={formData.name} onChange={(event) => setField('name', event.target.value.replace(/[^a-zA-Z\s.'-]/g, ''))} placeholder="Name" /></label>
                <label className="brief-line-field"><span>Email</span><input required type="email" value={formData.email} onChange={(event) => setField('email', event.target.value)} placeholder="you@company.com" /></label>
                <div className="brief-summary"><span>{formData.type}</span><span>{formData.location}</span><span>{formData.stage}</span><span>{formData.timeline}</span></div>
            </div>}
        </div>
        {status === 'error' && <p className="brief-error">{errorMessage}</p>}
        <div className="brief-actions">
            <button type="button" className="brief-back" disabled={step === 0} onClick={() => { setStatus('idle'); setStep((current) => Math.max(0, current - 1)); }}><ArrowLeft size={16} /> Back</button>
            <button type="submit" className="brief-next" disabled={step < 2 ? !canContinue : status === 'loading'}>{step === 2 ? (status === 'loading' ? 'Sending…' : 'Send the brief') : 'Continue'} {step === 2 ? <ArrowUpRight size={17} /> : <ArrowRight size={17} />}</button>
        </div>
    </form>;
}
