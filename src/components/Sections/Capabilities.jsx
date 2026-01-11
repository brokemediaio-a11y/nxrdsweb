import React, { useEffect } from 'react';
import { 
  Mic, 
  Workflow, 
  Database, 
  Zap, 
  MessageSquare, 
  LayoutDashboard, 
  FileText, 
  Box,
  Headset,
  ShieldCheck,
  Settings,
  TrendingUp
} from 'lucide-react';

const Capabilities = () => {
  useEffect(() => {
    // Tilt effect on hover
    const cards = document.querySelectorAll('.tilt');
    const maxTilt = 8;
    
    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const rx = ((y / rect.height) - 0.5) * -maxTilt;
        const ry = ((x / rect.width) - 0.5) * maxTilt;
        card.style.transform = `translateY(-6px) rotateX(${rx}deg) rotateY(${ry}deg)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });

    return () => {
      cards.forEach(card => {
        card.removeEventListener('mousemove', () => {});
        card.removeEventListener('mouseleave', () => {});
      });
    };
  }, []);

  const capabilities = [
    {
      icon: <Workflow size={20} />,
      title: 'Workflow Orchestration',
      description: 'Connect your CRM, calendars, email, WhatsApp/SMS, and internal tools with clean, auditable logic.'
    },
    {
      icon: <Headset size={20} />,
      title: 'AI Receptionist',
      description: '24/7 call handling, FAQs, lead qualification, appointment booking, and smart escalation.'
    },
    {
      icon: <ShieldCheck size={20} />,
      title: 'Compliance & Controls',
      description: 'Role-based access, safe prompt patterns, logging, and data minimization — built in.'
    },
    {
      icon: <Settings size={20} />,
      title: 'Custom Integrations',
      description: 'Webhook-first integrations and lightweight APIs to connect anything reliably.'
    },
    {
      icon: <TrendingUp size={20} />,
      title: 'Sales Systems',
      description: 'Lead routing, follow-up sequences, pipeline hygiene, and conversion analytics.'
    },
    {
      icon: <Box size={20} />,
      title: 'SaaS Foundations',
      description: 'Reusable templates, multi-tenant architecture patterns, and scalable configuration systems.'
    }
  ];

  return (
    <section id="work" className="section">
      <div className="container" style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
        <div className="section-title">
          <div className="glow-dot"></div>
          <h2>Capabilities that <span className="accent">ship</span></h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
          {capabilities.map((capability, index) => (
            <div key={capability.title} className="neo-card reveal tilt">
              <div className="inner">
                <div className="icon-bubble">
                  {capability.icon}
                </div>
                <h5>{capability.title}</h5>
                <p>{capability.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Capabilities;