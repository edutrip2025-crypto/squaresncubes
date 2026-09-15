import { useEffect, useRef, useState, type WheelEvent as ReactWheelEvent } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, ArrowLeft, ArrowRight, X } from 'lucide-react';
import { Layout } from '../components/layout/Layout';
import { allProjects } from '../lib/projectData';

interface Project {
    id: string; title: string; category: string; image: string;
    description: string; builtUpArea: string; location: string; floors: string;
    files: { name: string; url: string }[];
}
const order = ['tropical-villa', 'modern-luxury-house', 'cafe', 'office', 'indian-contemporary', 'british-manor'];
const projects = [...allProjects as Project[]].sort((a, b) => {
    const rank = (id: string) => order.includes(id) ? order.indexOf(id) : 99;
    return rank(a.id) - rank(b.id);
});

function ProjectViewer({ project, close }: { project: Project; close: () => void }) {
    const dialog = useRef<HTMLDialogElement>(null);
    const [index, setIndex] = useState(0);
    const count = project.files.length;
    useEffect(() => {
        const node = dialog.current!;
        const previous = document.activeElement as HTMLElement | null;
        node.showModal();
        const overflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => { node.close(); document.body.style.overflow = overflow; previous?.focus(); };
    }, []);
    return (
        <dialog ref={dialog} className="work-dialog" aria-labelledby="project-title" onCancel={(event) => { event.preventDefault(); close(); }}
            onKeyDown={(event) => {
                if (event.key === 'ArrowRight') { event.preventDefault(); setIndex((i) => (i + 1) % count); }
                if (event.key === 'ArrowLeft') { event.preventDefault(); setIndex((i) => (i - 1 + count) % count); }
            }}>
            <motion.div className="project-viewer" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
                <div className="viewer-bar">
                    <span>{project.category} / Project study</span>
                    <button onClick={close} aria-label="Close project"><X size={21} /></button>
                </div>
                <div className="viewer-image">
                    <AnimatePresence mode="wait">
                        <motion.img key={index} src={project.files[index]?.url || project.image} alt={project.title + ' — view ' + (index + 1)}
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} />
                    </AnimatePresence>
                    <div className="viewer-controls">
                        <span>{String(index + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}</span>
                        <div>
                            <button aria-label="Previous image" onClick={() => setIndex((i) => (i - 1 + count) % count)}><ArrowLeft size={18} /></button>
                            <button aria-label="Next image" onClick={() => setIndex((i) => (i + 1) % count)}><ArrowRight size={18} /></button>
                        </div>
                    </div>
                </div>
                <div className="viewer-info">
                    <div><h2 id="project-title">{project.title}</h2>
                        <dl>{[['Location', project.location], ['Area', project.builtUpArea], ['Floors', project.floors]].filter(([, value]) => value).map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
                    </div>
                    <div>{project.description && <p>{project.description}</p>}<Link to="/contact" onClick={close}>Discuss a similar project <ArrowUpRight size={16} /></Link></div>
                </div>
                <div className="viewer-thumbnails" aria-label="Project images">{project.files.map((file, i) => <button key={file.url} aria-label={'View image ' + (i + 1)} aria-pressed={index === i} onClick={() => setIndex(i)}><img loading="lazy" src={file.url} alt="" /></button>)}</div>
            </motion.div>
        </dialog>
    );
}

export function Portfolio() {
    const [params, setParams] = useSearchParams();
    const sector = ['Residential', 'Commercial'].includes(params.get('sector') || '') ? params.get('sector')! : 'All';
    const selected = projects.find((project) => project.id === params.get('project'));
    const filtered = projects.filter((project) => sector === 'All' || project.category === sector);
    const [projectIndex, setProjectIndex] = useState(0);
    const [imageIndex, setImageIndex] = useState(-1);
    const [projectDirection, setProjectDirection] = useState(1);
    const leftWheelLock = useRef(0);
    const rightWheelLock = useRef(0);
    const project = filtered[Math.min(projectIndex, Math.max(0, filtered.length - 1))] || projects[0];
    const projectImages = project.files.filter((file, index, files) => file.url !== project.image && files.findIndex((candidate) => candidate.url === file.url) === index);

    useEffect(() => {
        const previous = document.body.style.overflow;
        const desktop = window.matchMedia('(min-width: 768px)');
        const syncPageLock = () => { document.body.style.overflow = desktop.matches ? 'hidden' : previous; };
        syncPageLock();
        desktop.addEventListener('change', syncPageLock);
        return () => { desktop.removeEventListener('change', syncPageLock); document.body.style.overflow = previous; };
    }, []);

    useEffect(() => {
        setProjectIndex(0);
        setImageIndex(-1);
    }, [sector]);

    function moveProject(direction: number) {
        setProjectDirection(direction);
        setProjectIndex((current) => (current + direction + filtered.length) % filtered.length);
        setImageIndex(-1);
    }

    function handleLeftWheel(event: ReactWheelEvent<HTMLDivElement>) {
        event.preventDefault();
        if (Math.abs(event.deltaY) < 12 || Date.now() - leftWheelLock.current < 720) return;
        leftWheelLock.current = Date.now();
        moveProject(event.deltaY > 0 ? 1 : -1);
    }

    function handleRightWheel(event: ReactWheelEvent<HTMLDivElement>) {
        event.preventDefault();
        if (Math.abs(event.deltaY) < 12 || Date.now() - rightWheelLock.current < 560) return;
        rightWheelLock.current = Date.now();
        setImageIndex((current) => Math.max(-1, Math.min(projectImages.length - 1, current + (event.deltaY > 0 ? 1 : -1))));
    }

    function openPreview() {
        const next = new URLSearchParams(params);
        next.set('project', project.id);
        setParams(next, { preventScrollReset: true });
    }
    function close() { const next = new URLSearchParams(params); next.delete('project'); setParams(next, { replace: true, preventScrollReset: true }); }
    return (
        <Layout>
            <div className="split-work">
                <section className="split-work-main" onWheel={handleLeftWheel} aria-label="Scroll to browse projects">
                    <div className="split-work-toolbar">
                        <span>Work / {String(filtered.length).padStart(2, '0')}</span>
                        <nav aria-label="Project categories">{['All', 'Residential', 'Commercial'].map((category) => <button key={category} aria-pressed={sector === category} onClick={() => setParams(category === 'All' ? {} : { sector: category }, { replace: true, preventScrollReset: true })}>{category}</button>)}</nav>
                    </div>

                    <div className="project-dots" aria-label="Choose a project">
                        {filtered.map((item, index) => <button key={item.id} aria-label={item.title} aria-pressed={projectIndex === index} onClick={() => { setProjectDirection(index > projectIndex ? 1 : -1); setProjectIndex(index); setImageIndex(-1); }}><span>{String(index + 1).padStart(2, '0')}</span></button>)}
                    </div>

                    <button className="main-project-stage" onClick={openPreview} aria-label={`Open ${project.title}`}>
                        <AnimatePresence initial={false} custom={projectDirection}>
                            <motion.img key={project.id} src={project.image} alt={project.title} custom={projectDirection}
                                initial={{ opacity: 0, y: projectDirection * 90, scale: 1.035 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: projectDirection * -55, scale: .985 }}
                                transition={{ duration: .72, ease: [0.16, 1, 0.3, 1] }} />
                        </AnimatePresence>
                        <span className="main-project-shade" />
                        <motion.div key={`${project.id}-copy`} className="main-project-copy" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .2, duration: .55 }}>
                            <span>{String(projectIndex + 1).padStart(2, '0')} / {project.category}</span>
                            <h1>{project.title}</h1>
                            <small>{project.location || 'India'} <ArrowUpRight size={15} /></small>
                        </motion.div>
                    </button>
                    <div className="pane-instruction"><span>Cursor here</span><strong>Scroll to change project</strong></div>
                </section>

                <section className="split-work-views" onWheel={handleRightWheel} aria-label="Scroll to reveal project images">
                    <div className="views-toolbar"><span>Project views</span><span>{String(imageIndex + 1).padStart(2, '0')} / {String(projectImages.length).padStart(2, '0')}</span></div>
                    <div className="view-stack">
                        <div className={`view-stack-empty ${imageIndex >= 0 ? 'is-covered' : ''}`}>
                            <span>{String(projectIndex + 1).padStart(2, '0')}</span>
                            <p>Scroll here<br />to reveal the project</p>
                        </div>
                        <AnimatePresence initial={false}>
                            {projectImages.slice(0, imageIndex + 1).map((file, index) => {
                                const depth = imageIndex - index;
                                return <motion.button key={`${project.id}-${file.url}`} className="view-stack-card" style={{ zIndex: index + 1 }} onClick={openPreview} aria-label={`Open ${project.title}, view ${index + 1}`}
                                    initial={{ y: '105%', opacity: 1 }} animate={{ y: -Math.min(depth * 9, 27), scale: 1 - Math.min(depth * .009, .027) }} exit={{ y: '105%' }}
                                    transition={{ duration: .78, ease: [0.16, 1, 0.3, 1] }}>
                                    <img src={file.url} alt={`${project.title} — ${file.name}`} />
                                    <span className="view-card-caption"><span>{String(index + 1).padStart(2, '0')} / {file.name}</span><ArrowUpRight size={16} /></span>
                                </motion.button>;
                            })}
                        </AnimatePresence>
                    </div>
                    <div className="pane-instruction pane-instruction-right"><span>Cursor here</span><strong>Scroll to layer images</strong></div>
                </section>
            </div>
            {selected && <ProjectViewer key={selected.id} project={selected} close={close} />}
        </Layout>
    );
}
