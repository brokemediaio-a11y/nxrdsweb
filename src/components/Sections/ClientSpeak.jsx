import React from 'react';

const ClientSpeak = () => {
  const testimonials = [
    {
      result: 'Result',
      quote: 'Conversational AI now handles 75% of our customer service.',
      highlight: '75%',
      description: 'We reduced repetitive inquiries and kept only high-value calls for live agents.',
      name: 'Maria S.',
      role: 'CRM Manager'
    },
    {
      result: 'Speed',
      quote: 'We went from 24/5 to 24/7 within 3 weeks.',
      highlight: '24/7',
      description: 'Bookings increased, missed calls dropped, and reporting became predictable.',
      name: 'Mike M.',
      role: 'CTO'
    },
    {
      result: 'Quality',
      quote: 'Fast delivery — and the agent actually sounds natural.',
      highlight: '',
      description: 'The experience feels premium while maintaining clear guardrails.',
      name: 'A. Raza',
      role: 'Operations Lead'
    }
  ];

  return (
    <section id="clients" className="section">
      <div className="container" style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
        <div className="section-title">
          <div className="glow-dot"></div>
          <h2>Client <span className="accent">Speak</span></h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
          {testimonials.map((testimonial, index) => (
            <div key={index} className="neo-card reveal">
              <div className="inner">
                <div className="tiny" style={{ marginBottom: '8px' }}>{testimonial.result}</div>
                <div className="quote">
                  "{testimonial.highlight ? (
                    <>
                      {testimonial.quote.split(testimonial.highlight)[0]}
                      <span style={{ color: '#ec4899' }}>{testimonial.highlight}</span>
                      {testimonial.quote.split(testimonial.highlight)[1]}
                    </>
                  ) : testimonial.quote}"
                </div>
                <p style={{ marginTop: '12px', color: 'var(--muted)' }}>{testimonial.description}</p>
                <div className="person">
                  <div className="avatar"></div>
                  <div>
                    <div style={{ fontWeight: 600 }}>{testimonial.name}</div>
                    <div className="role">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ClientSpeak;