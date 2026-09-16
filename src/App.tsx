import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Home } from './pages/Home';
import { Portfolio } from './pages/Portfolio';
import { Services } from './pages/Services';
import { Contact } from './pages/Contact';
import ScrollToTop from './components/ScrollToTop';

import { useState } from 'react';
import { AnimatePresence, motion, MotionConfig } from 'framer-motion';
import { SplashScreen } from './components/SplashScreen';
import { BrandLogo } from './components/BrandLogo';

import { useRef, useEffect } from 'react';

function AnimatedRoutes() {
  const location = useLocation();
  const isInitial = useRef(true);
  useEffect(() => {
    isInitial.current = false;
  }, []);
  
  const curtainDelay = isInitial.current ? 1.5 : 0.1;

  return <AnimatePresence mode="wait" onExitComplete={() => window.scrollTo({ top: 0, behavior: 'instant' })}>
    <motion.div 
      key={location.pathname + "-curtain"} 
      className="route-curtain flex items-center justify-center" 
      initial={{ clipPath: 'inset(0% 0% 0% 0%)' }} 
      animate={{ clipPath: 'inset(0% 0% 100% 0%)' }} 
      exit={{ clipPath: 'inset(0% 0% 0% 0%)' }}
      transition={{ duration: 0.8, delay: curtainDelay, ease: [0.76, 0, 0.24, 1] }} 
      style={{ zIndex: 100 }} 
    >
      <BrandLogo tone="black" className="w-16 h-16 md:w-24 md:h-24 opacity-80" />
    </motion.div>
    <motion.div 
      key={location.pathname} 
      initial={{ opacity: 1 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 1 }} 
      transition={{ duration: 0.9 }}
    >
      <Routes location={location}>
        <Route path="/" element={<Home />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/services" element={<Services />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </motion.div>
  </AnimatePresence>;
}

function App() {
  const [loading, setLoading] = useState(true);

  return (
    <MotionConfig reducedMotion="user"><BrowserRouter>
      <AnimatePresence mode="wait">
        {loading && <SplashScreen onComplete={() => setLoading(false)} />}
      </AnimatePresence>
      <ScrollToTop />
      <AnimatedRoutes />
    </BrowserRouter></MotionConfig>
  );
}

export default App;
