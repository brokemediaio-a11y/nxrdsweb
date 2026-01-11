import { useEffect } from 'react';
import { motion } from 'framer-motion';
// @ts-ignore
import Layout from './components/Layout/Layout';
// @ts-ignore
import Hero from './components/Hero/Hero';
// @ts-ignore
import Services from './components/Sections/Services';
// @ts-ignore
import Capabilities from './components/Sections/Capabilities';
// @ts-ignore
import ClientSpeak from './components/Sections/ClientSpeak';
// @ts-ignore
import Contact from './components/Sections/Contact';

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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Layout>
        <Hero />
        <Services />
        <Capabilities />
        <ClientSpeak />
        <Contact />
      </Layout>
    </motion.div>
  );
}

export default App;