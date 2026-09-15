import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useReducedMotion, useSpring } from 'framer-motion';
import { ArrowDown, ArrowUpRight, Pause, Play } from 'lucide-react';
import { Layout } from '../components/layout/Layout';
import { CubeScene } from '../components/3d/CubeScene';
import house from '../assets/Residential/Modern Luxury House/A.png';
import villa from '../assets/Residential/Tropical Villa/A.png';
import cafe from '../assets/Commercial/Cafe/A.png';

const work = [
    { title: 'Tropical Villa', category: 'Residential', image: villa, id: 'tropical-villa' },
    { title: 'Modern Luxury House', category: 'Residential', image: house, id: 'modern-luxury-house' },
    { title: 'Café', category: 'Commercial', image: cafe, id: 'cafe' },
];

function WorkScene({ project, index }: { project: typeof work[number]; index: number }) {
    const ref = useRef<HTMLElement>(null);
    const reduced = useReducedMotion();
    const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
    const imageX = useTransform(scrollYProgress, [0, 0.5, 1], index % 2 ? ['11%', '0%', '-7%'] : ['-11%', '0%', '7%']);
    const imageY = useTransform(scrollYProgress, [0, 0.5, 1], ['8%', '0%', '-7%']);
    const imagePan = useTransform(scrollYProgress, [0, 1], ['-7%', '7%']);
    const rotateY = useTransform(scrollYProgress, [0, 0.5, 1], index % 2 ? [-6, 0, 4] : [6, 0, -4]);
    const copyY = useTransform(scrollYProgress, [0, 0.5, 1], [65, 0, -55]);
    const underlayY = useTransform(scrollYProgress, [0, 1], [45, -35]);
    return (
        <section ref={ref} className={`work-scene ${index % 2 ? 'is-right' : 'is-left'}`}>
            <motion.div className="work-underlay" style={reduced ? {} : { y: underlayY }}><span>0{index + 1}</span></motion.div>
            <motion.div className="work-image-layer" style={reduced ? {} : { x: imageX, y: imageY, rotateY }}>
                <motion.img src={project.image} alt={project.title} loading="lazy" style={reduced ? {} : { y: imagePan }} />
                <div className="work-shade" />
            </motion.div>
            <motion.div className="work-caption work-copy-layer" style={reduced ? {} : { y: copyY }}>
                <span className="scene-index">0{index + 1} / {project.category}</span>
                <Link to={`/portfolio?sector=${project.category}&project=${project.id}`}>
                    <h2>{project.title}</h2><ArrowUpRight aria-hidden="true" />
                </Link>
            </motion.div>
        </section>
    );
}

export function Home() {
    const journey = useRef<HTMLElement>(null);
    const reduced = useReducedMotion();
    const [paused, setPaused] = useState(false);
    const { scrollYProgress } = useScroll({ target: journey, offset: ['start start', 'end end'] });
    const smoothProgress = useSpring(scrollYProgress, { stiffness: 48, damping: 24, mass: 0.65, restDelta: 0.0005 });
    const titleY = useTransform(smoothProgress, [0, 0.14], [0, -90]);
    const titleOpacity = useTransform(smoothProgress, [0, 0.1], [1, 0]);
    const chapterOne = useTransform(smoothProgress, [0.11, 0.17, 0.27, 0.32], [0, 1, 1, 0]);
    const chapterTwo = useTransform(smoothProgress, [0.3, 0.37, 0.47, 0.52], [0, 1, 1, 0]);
    const chapterThree = useTransform(smoothProgress, [0.5, 0.57, 0.67, 0.72], [0, 1, 1, 0]);
    const chapterFour = useTransform(smoothProgress, [0.7, 0.77, 0.87, 0.92], [0, 1, 1, 0]);
    const chapterFive = useTransform(smoothProgress, [0.9, 0.96, 1], [0, 1, 1]);
    const progressWidth = useTransform(smoothProgress, [0, 1], ['0%', '100%']);
    return (
        <Layout>
            <div className="spatial-home">
                <section ref={journey} className={`architecture-journey ${reduced ? 'reduced-journey' : ''}`}>
                    <div className="architecture-stage">
                        <div className="residence-canvas"><CubeScene progress={smoothProgress} still={paused || !!reduced} /></div>
                        <div className="stage-vignette" />
                        <motion.div className="architecture-title" style={{ y: reduced ? 0 : titleY, opacity: titleOpacity }}>
                            <span className="scene-index">Squares N Cubes / Architecture & interiors</span>
                            <h1>Space.<br /><span>Considered.</span></h1>
                        </motion.div>
                        <motion.div className="architecture-chapter" style={{ opacity: chapterOne }}>
                            <span className="scene-index">01 / Trace</span><h2>A line becomes<br />a direction.</h2>
                        </motion.div>
                        <motion.div className="architecture-chapter chapter-right" style={{ opacity: chapterTwo }}>
                            <span className="scene-index">02 / Frame</span><h2>Structure defines<br />the in-between.</h2>
                        </motion.div>
                        <motion.div className="architecture-chapter chapter-center" style={{ opacity: chapterThree }}>
                            <span className="scene-index">03 / Material</span><h2>Surface holds<br />memory.</h2>
                        </motion.div>
                        <motion.div className="architecture-chapter chapter-low" style={{ opacity: chapterFour }}>
                            <span className="scene-index">04 / Inhabit</span><h2>Space begins<br />with people.</h2>
                        </motion.div>
                        <motion.div className="architecture-chapter chapter-right chapter-final" style={{ opacity: chapterFive }}>
                            <span className="scene-index">05 / Reveal</span><h2>Enter the work.</h2>
                        </motion.div>
                        <div className="stage-bottom">
                            <span className="scene-index"><ArrowDown size={13} /> Scroll to explore</span>
                            <span className="concept-caption">Spatial film / scroll to move</span>
                            <button onClick={() => setPaused(!paused)} aria-label={paused ? 'Enable pointer motion' : 'Pause pointer motion'} title={paused ? 'Enable pointer motion' : 'Pause pointer motion'}>
                                {paused ? <Play size={14} /> : <Pause size={14} />}
                            </button>
                        </div>
                        <motion.div className="journey-progress" style={{ width: progressWidth }} />
                    </div>
                </section>
                <section className="work-intro">
                    <span className="scene-index">Selected work / 01—03</span>
                    <h2>Places to live.<br />Spaces to feel.</h2>
                    <Link to="/portfolio">All projects <ArrowUpRight size={19} /></Link>
                </section>
                {work.map((project, index) => <WorkScene key={project.id} project={project} index={index} />)}
            </div>
        </Layout>
    );
}
