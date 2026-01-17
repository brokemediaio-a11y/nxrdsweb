'use client';

import { cn } from '../../lib/utils';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { Marquee } from '../UI/Marquee';

export function Highlight({
  children,
  className,
}) {
  return (
    <span
      className={cn(
        'bg-accent-pink/10 p-1 py-0.5 font-bold text-accent-pink',
        className,
      )}
    >
      {children}
    </span>
  );
}

export function TestimonialCard({
  description,
  name,
  img,
  role,
  className,
  ...props
}) {
  return (
    <div
      className={cn(
        'testimonial-card flex cursor-pointer break-inside-avoid flex-col items-start justify-between',
        className,
      )}
      style={{
        width: '100%',
        maxWidth: '100%',
        borderRadius: '16px',
        border: '1px solid rgba(255,255,255,.1)',
        background: 'rgba(255,255,255,.03)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        boxShadow: '0 8px 32px rgba(0,0,0,.3)',
        transition: 'all 0.3s ease',
        position: 'relative',
        overflow: 'hidden',
        marginBottom: '12px',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.borderColor = 'rgba(255,255,255,.15)';
        e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,.4)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.borderColor = 'rgba(255,255,255,.1)';
        e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,.3)';
      }}
      {...props}
    >
      {/* Light pink gradient reflection on left corner */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '60%',
          height: '60%',
          background: 'radial-gradient(ellipse 200px 150px at 0% 0%, rgba(236,72,153,0.15), transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0,
          borderRadius: '16px 0 0 0',
        }}
      />
      <div style={{ padding: '16px', width: '100%', position: 'relative', zIndex: 1 }}>
        <div 
          style={{ 
            color: 'rgba(255,255,255,.7)',
            fontSize: '0.875rem',
            lineHeight: '1.6',
            marginBottom: '12px',
            fontWeight: 400,
          }}
        >
          {description}
          <div className="flex flex-row py-1 gap-1" style={{ marginTop: '10px' }}>
            <Star className="size-4 fill-accent-pink text-accent-pink" />
            <Star className="size-4 fill-accent-pink text-accent-pink" />
            <Star className="size-4 fill-accent-pink text-accent-pink" />
            <Star className="size-4 fill-accent-pink text-accent-pink" />
            <Star className="size-4 fill-accent-pink text-accent-pink" />
          </div>
        </div>

        <div className="flex w-full items-center justify-start gap-3">
          <img
            width={36}
            height={36}
            src={img || ''}
            alt={name}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              objectFit: 'cover',
              border: '1px solid rgba(255,255,255,.1)',
            }}
          />

          <div>
            <p 
              style={{ 
                color: 'rgba(255,255,255,.95)',
                fontWeight: 500,
                margin: 0,
                fontSize: '0.875rem',
                lineHeight: '1.2',
              }}
            >
              {name}
            </p>
            <p 
              style={{ 
                color: 'rgba(255,255,255,.6)',
                fontSize: '0.75rem',
                margin: 0,
                marginTop: '2px',
                fontWeight: 400,
              }}
            >
              {role}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

const testimonials = [
  {
    name: 'Maria S.',
    role: 'CRM Manager',
    img: 'https://randomuser.me/api/portraits/women/22.jpg',
    description: (
      <p>
        Conversational AI now handles{' '}
        <Highlight>75% of our customer service.</Highlight> We reduced
        repetitive inquiries and kept only high-value calls for live agents.
      </p>
    ),
  },
  {
    name: 'Mike M.',
    role: 'CTO',
    img: 'https://randomuser.me/api/portraits/men/33.jpg',
    description: (
      <p>
        We went from <Highlight>24/5 to 24/7 within 3 weeks.</Highlight> Bookings
        increased, missed calls dropped, and reporting became predictable.
      </p>
    ),
  },
  {
    name: 'A. Raza',
    role: 'Operations Lead',
    img: 'https://randomuser.me/api/portraits/men/32.jpg',
    description: (
      <p>
        Fast delivery — and the agent actually sounds natural. The experience
        feels <Highlight>premium while maintaining clear guardrails.</Highlight>
      </p>
    ),
  },
  {
    name: 'Sarah Chen',
    role: 'Product Director',
    img: 'https://randomuser.me/api/portraits/women/44.jpg',
    description: (
      <p>
        The AI systems we built with Nexordis have{' '}
        <Highlight>reduced operational costs by 40%.</Highlight> The automation
        handles complex workflows seamlessly.
      </p>
    ),
  },
  {
    name: 'David Park',
    role: 'Founder',
    img: 'https://randomuser.me/api/portraits/men/55.jpg',
    description: (
      <p>
        Our custom AI solution went live in just{' '}
        <Highlight>2 weeks instead of months.</Highlight> The team delivered
        exactly what we needed.
      </p>
    ),
  },
  {
    name: 'Emily Watson',
    role: 'Head of Engineering',
    img: 'https://randomuser.me/api/portraits/women/67.jpg',
    description: (
      <p>
        The machine learning models they developed are{' '}
        <Highlight>performing better than our in-house solution.</Highlight> Highly
        recommend their expertise.
      </p>
    ),
  },
  {
    name: 'James Liu',
    role: 'VP of Technology',
    img: 'https://randomuser.me/api/portraits/men/78.jpg',
    description: (
      <p>
        Seamless integration with our existing infrastructure.{' '}
        <Highlight>The DevOps team was impressed with the deployment.</Highlight>
      </p>
    ),
  },
  {
    name: 'Lisa Anderson',
    role: 'Business Operations',
    img: 'https://randomuser.me/api/portraits/women/89.jpg',
    description: (
      <p>
        The automation has freed up our team to focus on{' '}
        <Highlight>strategic work instead of repetitive tasks.</Highlight> Game
        changer for our workflow.
      </p>
    ),
  },
  {
    name: 'Ryan Martinez',
    role: 'Technical Lead',
    img: 'https://randomuser.me/api/portraits/men/92.jpg',
    description: (
      <p>
        Their web and mobile development expertise is top-notch.{' '}
        <Highlight>Delivered a scalable solution that's performing beautifully.</Highlight>
      </p>
    ),
  },
  {
    name: 'Nina Patel',
    role: 'CEO',
    img: 'https://randomuser.me/api/portraits/women/29.jpg',
    description: (
      <p>
        From concept to production in record time.{' '}
        <Highlight>Nexordis made our vision a reality.</Highlight> The results speak
        for themselves.
      </p>
    ),
  },
  {
    name: 'Chris Taylor',
    role: 'IT Director',
    img: 'https://randomuser.me/api/portraits/men/35.jpg',
    description: (
      <p>
        The cloud infrastructure they set up has been{' '}
        <Highlight>rock solid with zero downtime.</Highlight> Exactly what we
        needed for our growing business.
      </p>
    ),
  },
  {
    name: 'Amanda White',
    role: 'Digital Transformation Lead',
    img: 'https://randomuser.me/api/portraits/women/42.jpg',
    description: (
      <p>
        Transformed our entire customer service experience.{' '}
        <Highlight>The AI agents are handling more than we expected.</Highlight>
      </p>
    ),
  },
];

export default function ClientSpeak() {
  // Split testimonials into 3 columns for staggered effect
  const column1 = testimonials.filter((_, i) => i % 3 === 0);
  const column2 = testimonials.filter((_, i) => i % 3 === 1);
  const column3 = testimonials.filter((_, i) => i % 3 === 2);

  return (
    <section id="clients" className="section" style={{ padding: '50px 0', position: 'relative' }}>
      {/* Decorative elements - Hidden on mobile for performance */}
      <div className="hidden md:block absolute top-20 -left-20 z-10 h-64 w-64 rounded-full bg-accent-pink/5 blur-3xl" />
      <div className="hidden md:block absolute -right-20 bottom-20 z-10 h-64 w-64 rounded-full bg-accent-pink/5 blur-3xl" />

      <div className="container" style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 16px', position: 'relative', zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-foreground mb-3 md:mb-4 text-center text-2xl md:text-4xl lg:text-5xl leading-[1.2] font-bold tracking-tighter px-2">
            What Our Users Are Saying
          </h2>
          <h3 className="text-muted-foreground mx-auto mb-6 md:mb-8 max-w-lg text-center text-sm md:text-lg font-medium tracking-tight text-balance px-2">
            Don&apos;t just take our word for it. Here&apos;s what{' '}
            <span className="font-semibold" style={{ color: '#ec4899' }}>
              real clients
            </span>{' '}
            are saying about{' '}
            <span className="font-semibold text-accent-pink">Nexordis</span>
          </h3>
        </motion.div>

        <div className="relative mt-4 md:mt-6 flex justify-center" style={{ height: '400px' }}>
          {/* Mobile: Single Column with All Testimonials */}
          <div className="block md:hidden w-full max-w-[90%] px-2">
            <div className="h-full overflow-hidden relative" style={{ isolation: 'isolate' }}>
              <Marquee
                uniqueId="mobile-testimonials"
                vertical={true}
                pauseOnHover={true}
                duration="80s"
                repeat={4}
              >
                {testimonials.map((card, idx) => (
                  <TestimonialCard key={`mobile-${idx}`} {...card} />
                ))}
              </Marquee>
            </div>
          </div>

          {/* Desktop/Tablet: 3 Column Grid Layout */}
          <div className="hidden md:grid grid-cols-2 xl:grid-cols-3 gap-3 md:gap-4 w-full max-w-[900px]">
            {/* Column 1 - Fastest (42s) */}
            <div 
              key="testimonial-column-1"
              className="h-full overflow-hidden relative"
              style={{
                isolation: 'isolate',
              }}
            >
              <Marquee
                key="marquee-col-1"
                uniqueId="column-1-testimonials"
                vertical={true}
                pauseOnHover={true}
                duration="42s"
                repeat={4}
              >
                {column1.map((card, idx) => (
                  <TestimonialCard key={`col1-${idx}`} {...card} />
                ))}
              </Marquee>
            </div>

            {/* Column 2 - Medium Speed (46s) */}
            <div 
              key="testimonial-column-2"
              className="h-full overflow-hidden relative"
              style={{
                isolation: 'isolate',
              }}
            >
              <Marquee
                key="marquee-col-2"
                uniqueId="column-2-testimonials"
                vertical={true}
                pauseOnHover={true}
                duration="46s"
                repeat={4}
              >
                {column2.map((card, idx) => (
                  <TestimonialCard key={`col2-${idx}`} {...card} />
                ))}
              </Marquee>
            </div>

            {/* Column 3 - Slowest (60s) */}
            <div 
              key="testimonial-column-3"
              className="h-full overflow-hidden relative"
              style={{
                isolation: 'isolate',
              }}
            >
              <Marquee
                key="marquee-col-3"
                uniqueId="column-3-testimonials"
                vertical={true}
                pauseOnHover={true}
                duration="60s"
                repeat={4}
              >
                {column3.map((card, idx) => (
                  <TestimonialCard key={`col3-${idx}`} {...card} />
                ))}
              </Marquee>
            </div>
          </div>

          {/* Gradient Fade Effects */}
          <div className="from-background pointer-events-none absolute inset-x-0 bottom-0 h-1/4 w-full bg-gradient-to-t from-20%"></div>
          <div className="from-background pointer-events-none absolute inset-x-0 top-0 h-1/4 w-full bg-gradient-to-b from-20%"></div>
        </div>
      </div>
    </section>
  );
}
