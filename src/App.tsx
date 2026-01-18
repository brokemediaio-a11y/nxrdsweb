import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { LenisProvider } from './contexts/LenisContext';
// @ts-ignore
import Layout from './components/Layout/Layout';
// @ts-ignore
import Navbar from './components/Navigation/Navbar';
// @ts-ignore
import Hero from './components/Hero/Hero';
// @ts-ignore
import Services from './components/Sections/Services';
// @ts-ignore
import Capabilities from './components/Sections/Capabilities';
// @ts-ignore
import ClientSpeak from './components/Sections/ClientSpeak';
// @ts-ignore
import AboutUs from './components/Sections/AboutUs';
// @ts-ignore
import Contact from './components/Sections/Contact';
// @ts-ignore
import TechStack from './components/Sections/TechStack';

function App() {

  useEffect(() => {
    // Initialize reveal animations - make all elements visible immediately
    const initReveal = () => {
      const revealElements = document.querySelectorAll('.reveal');
      
      if (revealElements.length === 0) return;
      
      // Immediately show ALL elements - elements are visible by default in CSS
      revealElements.forEach((el) => {
        el.classList.add('show');
      });
    };

    // Run immediately and after React renders
    initReveal();
    const timer1 = setTimeout(initReveal, 100);
    const timer2 = setTimeout(initReveal, 300);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  return (
    <LenisProvider>
      {/* Navbar uses portal to render in document.body but needs Lenis context for scrollTo */}
      <Navbar />
      <div style={{ position: 'relative', zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          style={{
            willChange: 'opacity',
            transform: 'translateZ(0)',
            WebkitTransform: 'translateZ(0)',
            position: 'relative',
            zIndex: 1
          }}
        >
          <Layout>
            <Hero />
            <Services />
            <Capabilities />
            <TechStack />
            <AboutUs />
            <ClientSpeak />
            <Contact />
          </Layout>
        </motion.div>
      </div>
    </LenisProvider>
  );
}

export default App;