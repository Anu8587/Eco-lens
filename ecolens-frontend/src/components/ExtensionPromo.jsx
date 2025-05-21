// src/components/ExtensionPromo.jsx
import { motion } from 'framer-motion';
import { FaCheck } from 'react-icons/fa';
import placeholderBanner from '../assets/placeholder-banner.png';

const ExtensionPromo = () => {
  return (
    <section className="relative py-16 px-10 md:px-24 overflow-hidden">
      {/* Background Leaves (for visual excitement) */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <svg
            key={i}
            className="absolute text-[#506850]/80"
            style={{
              width: `20px`,
              height: `20px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `fall 15s ease-in-out infinite`,
              animationDelay: `${Math.random() * 8}s`,
              transform: `rotate(${Math.random() * 360}deg)`,
              opacity: `0.4`,
            }}
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 3C12 3 9 6 9 9C9 12 12 15 12 15C12 15 15 12 15 9C15 6 12 3 12 3Z" />
          </svg>
        ))}
      </div>
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-center gap-8 max-w-5xl mx-auto">
        {/* Left Side: Banner Image */}
        <motion.div
          className="w-full md:w-2/5"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <img
            src={placeholderBanner}
            alt="EcoLens Browser Extension Banner"
            className="w-full h-auto rounded-lg shadow-md border border-[#6e8f6e]/40"
          />
        </motion.div>

        {/* Right Side: Extension Promo Content */}
        <motion.div
          className="w-full md:w-3/5 p-8 bg-[#506850]/30 bg-gradient-to-b from-[#e8f0e8]/80 to-[#6e8f6e]/40 backdrop-blur-md border border-[#6e8f6e]/40 rounded-lg shadow-lg"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
        >
          <h2 className="text-2xl md:text-3xl font-inter font-bold text-[#1a2c1a] text-center mb-4">
            Get the EcoLens Browser Extension
          </h2>
          <p className="text-base md:text-lg font-inter text-[#2f3b2f] text-center mb-6">
            Take sustainability with you everywhere you browse!
          </p>
          {/* Benefits List */}
          <ul className="space-y-4 mb-8">
            {[
              'Real-time eco-impact analysis while shopping online.',
              'Seamless product scanning with one click.',
              'Personalized eco-tips for every product.',
              'Contribute to a greener planet with every purchase.',
            ].map((benefit, index) => (
              <motion.li
                key={index}
                className="flex items-center gap-3 text-[#1a2c1a] text-base"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
              >
                <FaCheck color="#88a978" />
                <span>{benefit}</span>
              </motion.li>
            ))}
          </ul>
          {/* Download Button */}
          <motion.button
            className="w-full px-6 py-3 bg-gradient-to-r from-[#506850] to-[#88a978] text-[#f0f5f0] font-inter font-medium text-base rounded-sm border border-[#6e8f6e] hover:from-[#88a978] hover:to-[#a8c7a8] hover:border-[#88a978] hover:shadow-lg hover:shadow-[#88a978]/50 focus:outline-none focus:ring-2 focus:ring-[#88a978]/40 transition-all duration-300"
            whileHover={{ scale: 1.05, boxShadow: '0 0 15px rgba(136, 169, 120, 0.5)' }}
            whileTap={{ scale: 0.95 }}
          >
            Download Now
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default ExtensionPromo;