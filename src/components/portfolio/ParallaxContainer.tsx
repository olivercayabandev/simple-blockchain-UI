import { ReactNode, useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface ParallaxContainerProps {
  children: ReactNode;
  speed?: number;
  className?: string;
  offset?: number;
}

export function ParallaxContainer({
  children,
  speed = 50,
  className = '',
  offset = 0
}: ParallaxContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={containerRef}
      className={className}
      style={{
        y: offset !== 0 ? undefined : undefined,
      }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}

interface ParallaxSectionProps {
  children: ReactNode;
  className?: string;
  backgroundImage?: string;
}

export function ParallaxSection({
  children,
  className = '',
  backgroundImage
}: ParallaxSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      ref={sectionRef}
      className={`relative overflow-hidden ${className}`}
      style={backgroundImage ? {
        backgroundImage: `url(${backgroundImage})`,
        backgroundAttachment: 'fixed',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover'
      } : undefined}
    >
      {shouldReduceMotion ? (
        <div className="relative z-10">{children}</div>
      ) : (
        <motion.div
          className="relative z-10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          {children}
        </motion.div>
      )}
    </section>
  );
}
