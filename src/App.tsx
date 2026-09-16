import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Home } from './pages/Home';
import { Portfolio } from './pages/Portfolio';
import { Services } from './pages/Services';
import { Contact } from './pages/Contact';
import ScrollToTop from './components/ScrollToTop';

import { useState } from 'react';
import { AnimatePresence, motion, MotionConfig } from 'framer-motion';
import { SplashScreen } from './components/SplashScreen';

function AnimatedRoutes() {
  const location = useLocation();
  return <AnimatePresence mode="wait" onExitComplete={() => window.scrollTo({ top: 0, behavior: 'instant' })}>
    <motion.div key={location.pathname} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
      <motion.div className="route-curtain" initial={{ scaleY: 1 }} animate={{ scaleY: 0 }} transition={{ duration: 0.8, delay: 0.15, ease: [0.76, 0, 0.24, 1] }} />
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
      {!loading && <AnimatedRoutes />}
    </BrowserRouter></MotionConfig>
  );
}

export default App;
