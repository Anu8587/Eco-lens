import { motion } from 'framer-motion';

export default function EcoMascot({ className = "w-12 h-12" }) {
  return (
    <motion.svg
      className={className}
      viewBox="0 0 24 24"
      initial={{ opacity: 0, rotate: 0 }}
      animate={{ opacity: 1, rotate: [0, 5, -5, 0] }}
      transition={{
        opacity: { duration: 1.5, ease: 'easeInOut', delay: 0.5 },
        rotate: { duration: 3, ease: 'easeInOut', repeat: Infinity, delay: 0.5 },
      }}
    >
      <defs>
        <linearGradient id="leafGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#6e8f6e', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#c2e0c2', stopOpacity: 1 }} />
        </linearGradient>
      </defs>
      <path
        d="M12 3C12 3 9 6 9 9C9 12 12 15 12 15C12 15 15 12 15 9C15 6 12 3 12 3Z"
        fill="url(#leafGradient)"
      />
    </motion.svg>
  );
}