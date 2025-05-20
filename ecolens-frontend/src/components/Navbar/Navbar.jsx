import { motion } from 'framer-motion';
import EcoMascot from '../Mascot/EcoMascot';

export default function Navbar() {
  const handleScroll = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="relative z-20 flex items-center justify-between px-6 md:px-16 py-0 bg-[#3f513f]/90 backdrop-blur-md border-b border-b-[#506850]/50 shadow-sm">
      {/* Logo and Leaf */}
      <div className="flex items-center gap-0">
        {/* Leaf Icon */}
        <EcoMascot className="w-18 h-18" />

        {/* EcoLens Logo Text */}
        <motion.div
          className="text-lg md:text-xl text-[#f0f5f0]"
          style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 700, letterSpacing: '0.05em' }}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          EcoLens
        </motion.div>
      </div>

      {/* Nav Buttons */}
      <div className="flex gap-8">
        {['home', 'about', 'contact'].map((item) => (
          <motion.button
            key={item}
            onClick={() => handleScroll(item)}
            className="text-[#f0f5f0] hover:text-[#9fbf99] font-['Urbanist'] text-sm md:text-base font-medium transition-colors duration-200"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
          >
            {item.charAt(0).toUpperCase() + item.slice(1)}
          </motion.button>
        ))}
      </div>
    </nav>
  );
}