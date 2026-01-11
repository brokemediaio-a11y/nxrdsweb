import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Button from '../UI/Button';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [showMessage, setShowMessage] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowMessage(true);
    setTimeout(() => {
      setShowMessage(false);
      setFormData({ name: '', email: '', message: '' });
    }, 3200);
  };

  return (
    <section id="contact" className="section">
      <div className="container" style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
        <div className="cta reveal" style={{ padding: '24px 32px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px', alignItems: 'center' }}>
            <div>
              <h2 style={{ marginBottom: '8px', letterSpacing: '.01em', fontSize: 'clamp(1.8rem, 3vw, 2.5rem)' }}>
                Let's build something <span style={{ color: '#ec4899' }}>serious</span>.
              </h2>
              <p style={{ color: 'rgba(255,255,255,.68)', lineHeight: '1.7', marginBottom: 0 }}>
                Tell us your use-case — we'll propose the fastest path to production, with clear scope, timeline, and measurable outcomes.
              </p>
              <div style={{ marginTop: '12px' }} className="tiny">
                Or email: <a className="link-neo" href="mailto:hello@nexordis.com">hello@nexordis.com</a>
              </div>
            </div>
            <div>
              <form className="neo-card" style={{ background: 'rgba(12,13,16,.55)', borderRadius: '22px' }} onSubmit={handleSubmit}>
                <div className="inner">
                  <div style={{ marginBottom: '12px' }}>
                    <label className="form-label tiny">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="form-control"
                      style={{
                        background: 'transparent',
                        color: 'white',
                        borderColor: 'rgba(255,255,255,.14)',
                        borderRadius: '8px',
                        padding: '8px 12px',
                        width: '100%',
                        border: '1px solid rgba(255,255,255,.14)'
                      }}
                      placeholder="Your name"
                      required
                    />
                  </div>
                  <div style={{ marginBottom: '12px' }}>
                    <label className="form-label tiny">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="form-control"
                      style={{
                        background: 'transparent',
                        color: 'white',
                        borderColor: 'rgba(255,255,255,.14)',
                        borderRadius: '8px',
                        padding: '8px 12px',
                        width: '100%',
                        border: '1px solid rgba(255,255,255,.14)'
                      }}
                      placeholder="you@company.com"
                      required
                    />
                  </div>
                  <div style={{ marginBottom: '12px' }}>
                    <label className="form-label tiny">What do you want to automate?</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      className="form-control"
                      style={{
                        background: 'transparent',
                        color: 'white',
                        borderColor: 'rgba(255,255,255,.14)',
                        borderRadius: '8px',
                        padding: '8px 12px',
                        width: '100%',
                        border: '1px solid rgba(255,255,255,.14)',
                        resize: 'vertical',
                        minHeight: '80px'
                      }}
                      rows={3}
                      placeholder="Describe your goal..."
                      required
                    />
                  </div>
                  <Button 
                    type="submit" 
                    variant="primary"
                    size="md"
                    style={{ width: '100%' }}
                  >
                    Request Demo →
                  </Button>
                  {showMessage && (
                    <div className="tiny" style={{ marginTop: '8px', color: '#ec4899', display: 'block' }}>
                      ✅ Thanks! (Demo submit UI only — hook this to your backend.)
                    </div>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '16px' }} className="tiny">
          © {new Date().getFullYear()} Nexordis — Built for speed, clarity, and scale.
        </div>
      </div>
    </section>
  );
};

export default Contact;