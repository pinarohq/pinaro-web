import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

/**
 * MagneticButton — pulls slightly toward cursor.
 */
export default function MagneticButton({ children, className, onClick, type = 'button', testid, asChild, ...rest }) {
  const ref = useRef(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const onMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setPos({ x: x * 0.25, y: y * 0.25 });
  };
  const onLeave = () => setPos({ x: 0, y: 0 });

  return (
    <motion.button
      ref={ref}
      type={type}
      data-magnetic
      data-testid={testid}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      onClick={onClick}
      animate={{ x: pos.x, y: pos.y }}
      transition={{ type: 'spring', stiffness: 220, damping: 18, mass: 0.6 }}
      className={cn(
        'relative inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5',
        'text-sm font-semibold tracking-tight',
        'bg-primary text-primary-foreground',
        'transition-shadow duration-300 hover:shadow-[0_0_60px_-10px_hsl(var(--primary))]',
        className,
      )}
      {...rest}
    >
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
}
