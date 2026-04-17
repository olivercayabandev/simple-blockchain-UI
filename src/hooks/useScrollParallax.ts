import { useScroll, useTransform, MotionValue } from 'framer-motion';
import { useRef } from 'react';

interface UseScrollParallaxOptions {
  speed?: number;
  direction?: 'vertical' | 'horizontal';
}

export function useScrollParallax(
  ref: React.RefObject<HTMLElement | null>,
  options: UseScrollParallaxOptions = {}
): {
  scrollYProgress: MotionValue<number>;
  y: MotionValue<string>;
  x: MotionValue<string>;
} {
  const { speed = 50, direction = 'vertical' } = options;

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start']
  });

  const y = useTransform(scrollYProgress, [0, 1], [`${speed}px`, `-${speed}px`]);
  const x = useTransform(scrollYProgress, [0, 1], direction === 'horizontal' ? [`${speed}px`, `-${speed}px`] : ['0px', '0px']);

  return { scrollYProgress, y, x };
}

export function useParallaxOffset(ref: React.RefObject<HTMLElement | null>, baseOffset: number = 0): MotionValue<string> {
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start']
  });

  return useTransform(scrollYProgress, [0, 1], [`${baseOffset}px`, `-${baseOffset}px`]);
}
