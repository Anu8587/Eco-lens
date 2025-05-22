// src/components/Navbar.jsx
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
    <nav className="fixed top-0 left-0 w-full z-50 bg-gradient-to-r from-[#506850] to-[#88a978] backdrop-blur-md shadow-md">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 md:px-10 py-3">
        {/* Left Corner: Logo and Mascot */}
        <div className="flex items-center gap-2">
          <EcoMascot className="w-8 h-8" />
          <motion.div
            className="text-lg md:text-xl text-[#f0f5f0] font-poppins font-medium tracking-tight"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            EcoLens
          </motion.div>
        </div>

        {/* Right Corner: Nav Links with Good Spacing */}
        <div className="flex gap-12">
          {['home', 'features', 'contact', 'newsletter'].map((item) => (
            <motion.button
              key={item}
              onClick={() => handleScroll(item)}
              className="nav-link text-[#f0f5f0] hover:text-[#d4e157] font-poppins text-sm font-light tracking-tight transition-colors duration-300"
              whileHover={{ scale: 1.1, transition: { duration: 0.2 } }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * (['home', 'features', 'contact', 'newsletter'].indexOf(item) + 1) }}
            >
              {item.charAt(0).toUpperCase() + item.slice(1)}
            </motion.button>
          ))}
        </div>
      </div>
    </nav>
  );
}