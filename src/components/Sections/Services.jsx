import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Brain, Briefcase, Globe, Smartphone, Cloud } from 'lucide-react';
import Button from '../UI/Button';

const Services = () => {
  const [activeTab, setActiveTab] = useState('agentic');

  const services = {
    agentic: {
      title: 'Agentic AI',
      icon: <Bot size={24} strokeWidth={1.5} />,
      desc: 'We design and deploy agentic AI systems that operate autonomously to streamline business operations and reduce costs. Our expertise includes conversational AI, AI receptionists, voice agents, and intelligent chat systems that handle customer interactions, scheduling, support, and internal workflows — working 24/7 while integrating seamlessly with your existing tools.'
    },
    ml: {
      title: 'Machine Learning & AI Development',
      icon: <Brain size={24} strokeWidth={1.5} />,
      desc: 'We build and train custom machine learning and AI models for business-specific intelligence and automation. From predictive analytics and forecasting systems to NLP and computer vision, we also deliver AI-powered web and mobile applications — such as data-driven platforms for energy prediction, performance analysis, and real-time decision support powered by ML models.'
    },
    business: {
      title: 'Business Software Development',
      icon: <Briefcase size={24} strokeWidth={1.5} />,
      desc: 'We develop custom business software and SaaS products engineered for scalability, security, and performance. Whether it\'s internal enterprise systems, B2B platforms, or full-scale SaaS solutions, we transform complex business requirements into reliable software that supports real-world operations and growth.'
    },
    web: {
      title: 'Web Development',
      icon: <Globe size={24} strokeWidth={1.5} />,
      desc: 'We create high-performance, scalable web applications using modern architectures and frameworks. From corporate websites to complex web platforms, our solutions are optimized for speed, security, SEO, and seamless user experience across devices.'
    },
    mobile: {
      title: 'Mobile App Development',
      icon: <Smartphone size={24} strokeWidth={1.5} />,
      desc: 'We build robust, production-ready mobile applications for iOS and Android, designed to scale with your business. From MVPs to enterprise-grade apps, our mobile solutions support real-time data, backend integrations, and AI-powered features where required.'
    },
    devops: {
      title: 'DevOps & Cloud Infrastructure',
      icon: <Cloud size={24} strokeWidth={1.5} />,
      desc: 'Our dedicated DevOps team ensures your products go live globally with confidence. We handle cloud architecture, CI/CD pipelines, monitoring, and scaling across platforms like AWS, Azure, Vercel, VPS environments, Hostinger, and more. From deployment to optimization, we make your applications reliable, secure, and ready to scale worldwide.'
    }
  };

  const tabs = [
    { id: 'agentic', label: 'Agentic AI' },
    { id: 'ml', label: 'Machine Learning & AI Development' },
    { id: 'business', label: 'Business Software Development' },
    { id: 'web', label: 'Web Development' },
    { id: 'mobile', label: 'Mobile App Development' },
    { id: 'devops', label: 'DevOps & Cloud Infrastructure' }
  ];

  const activeService = services[activeTab];

  return (
    <section id="services" className="section">
      <div className="container" style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
        <div className="section-title">
          <div className="glow-dot"></div>
          <h2>Our <span className="accent">Services</span></h2>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
          <div className="tabs services-tabs" role="tablist" style={{ 
            display: 'flex',
            gap: '6px',
            background: 'rgba(255, 255, 255, 0.06)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            padding: '8px',
            borderRadius: '999px',
            backdropFilter: 'blur(14px)',
            WebkitBackdropFilter: 'blur(14px)',
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.1)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {tabs.map((tab) => (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                data-tab={tab.id}
                className="service-tab"
                style={{
                  position: 'relative',
                  border: 'none',
                  background: 'transparent',
                  color: activeTab === tab.id ? 'rgba(255, 255, 255, 0.95)' : 'rgba(255, 255, 255, 0.7)',
                  padding: '8px 18px',
                  borderRadius: '999px',
                  fontWeight: 600,
                  fontSize: '14px',
                  fontFamily: "'Lemon Milk', sans-serif",
                  cursor: 'pointer',
                  transition: 'color 0.3s ease',
                  zIndex: 1,
                  whiteSpace: 'nowrap'
                }}
                whileHover={{ color: 'rgba(255, 255, 255, 0.95)' }}
              >
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeServiceTab"
                    className="active-tab-bg"
                    style={{
                      position: 'absolute',
                      top: '4px',
                      left: '4px',
                      right: '4px',
                      bottom: '4px',
                      backdropFilter: 'blur(14px)',
                      WebkitBackdropFilter: 'blur(14px)',
                      background: 'rgba(255, 255, 255, 0.15)',
                      borderRadius: '999px',
                      border: '1px solid rgba(255, 255, 255, 0.25)',
                      boxShadow: '0 8px 32px 0 rgba(255, 255, 255, 0.1), inset 0 0 0 1px rgba(255, 255, 255, 0.2)',
                      zIndex: -1
                    }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
                <motion.div
                  layoutId={activeTab !== tab.id ? "hoverServiceTab" : undefined}
                  className={`tab-hover-glass ${activeTab === tab.id ? 'active-tab-hover' : ''}`}
                  style={{
                    position: 'absolute',
                    top: '4px',
                    left: '4px',
                    right: '4px',
                    bottom: '4px',
                    backdropFilter: 'blur(14px)',
                    WebkitBackdropFilter: 'blur(14px)',
                    background: 'rgba(255, 255, 255, 0.08)',
                    borderRadius: '999px',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    zIndex: activeTab === tab.id ? -2 : -1,
                    pointerEvents: 'none',
                    opacity: 0
                  }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
                <span style={{ position: 'relative', zIndex: 2 }}>
                  {tab.label}
                </span>
              </motion.button>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px', position: 'relative' }}>
          <div style={{ gridColumn: 'span 2', minHeight: '0' }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                className="neo-card services-card reveal show"
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 100 }}
                transition={{ 
                  duration: 0.6,
                  ease: [0.22, 1, 0.36, 1]
                }}
              >
                <div className="services-card-border-wrapper">
                  <motion.div
                    className="services-card-border-line"
                    initial={{ offsetDistance: '0%' }}
                    animate={{ offsetDistance: ['0%', '100%'] }}
                    transition={{
                      duration: 4,
                      ease: 'linear',
                      repeat: Infinity
                    }}
                  />
                </div>
                <div className="inner">
                  <div>
                    <div className="icon-bubble" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {activeService.icon}
                    </div>
                    <h3 style={{ marginTop: '12px', marginBottom: '12px', fontSize: '1.5rem', fontWeight: 600 }}>
                      {activeService.title}
                    </h3>
                    <p style={{ color: 'var(--muted)', lineHeight: '1.75', margin: 0, fontSize: '15px' }}>
                      {activeService.desc}
                    </p>
                  </div>

                  <div style={{ marginTop: '24px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    <Button
                      variant="primary"
                      size="md"
                      onClick={() => {
                        const contactSection = document.querySelector('#contact');
                        if (contactSection) {
                          contactSection.scrollIntoView({ behavior: 'smooth' });
                        }
                      }}
                    >
                      Get a Quote
                    </Button>
                    <Button
                      variant="outline"
                      size="md"
                      onClick={() => {
                        const workSection = document.querySelector('#work');
                        if (workSection) {
                          workSection.scrollIntoView({ behavior: 'smooth' });
                        }
                      }}
                    >
                      View Portfolio →
                    </Button>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;