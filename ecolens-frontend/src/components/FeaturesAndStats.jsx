// src/components/FeaturesAndStats.jsx
import { motion } from 'framer-motion';
import { FaSearch, FaLeaf, FaChartBar, FaDownload } from 'react-icons/fa';

const FeaturesAndStats = () => {
  return (
    <>
      {/* Features Section */}
      <section className="relative py-16 px-10 md:px-24 overflow-hidden">
        {/* Background Leaves (for visual consistency) */}
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
        <div className="relative z-10 max-w-5xl mx-auto">
          <motion.h2
            className="text-3xl md:text-4xl font-inter font-bold text-[#1a2c1a] text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            Why Choose EcoLens?
          </motion.h2>
          <div className="flex flex-col md:flex-row gap-8">
            {/* Card 1: Real-Time Environmental Analysis */}
            <motion.div
              className="flex-1 p-6 bg-gradient-to-br from-[#506850]/90 to-[#3b5f3b]/90 border border-[#6e8f6e]/60 rounded-lg shadow-md hover:shadow-lg hover:shadow-[#88a978]/40 transition-all duration-300"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
              whileHover={{
                scale: 1.05,
                borderColor: '#88a978',
                transition: { duration: 0.3 },
              }}
            >
              <motion.div
                className="flex items-center justify-center w-12 h-12 bg-[#88a978]/30 rounded-full mb-4"
                whileHover={{
                  rotate: 360,
                  backgroundColor: '#88a978',
                  transition: { duration: 0.5 },
                }}
              >
                <FaSearch color="#f0f5f0" size={24} />
              </motion.div>
              <h3 className="text-xl font-inter font-semibold text-[#f0f5f0] mb-2">
                Real-Time Environmental Analysis
              </h3>
              <p className="text-base font-inter text-[#d9e2d9]">
                Get instant insights into the environmental effects of products while you shop online.
              </p>
            </motion.div>
            {/* Card 2: Seamless Product Scanning */}
            <motion.div
              className="flex-1 p-6 bg-gradient-to-br from-[#506850]/90 to-[#3b5f3b]/90 border border-[#6e8f6e]/60 rounded-lg shadow-md hover:shadow-lg hover:shadow-[#88a978]/40 transition-all duration-300"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: 0.4 }}
              whileHover={{
                scale: 1.05,
                borderColor: '#88a978',
                transition: { duration: 0.3 },
              }}
            >
              <motion.div
                className="flex items-center justify-center w-12 h-12 bg-[#88a978]/30 rounded-full mb-4"
                whileHover={{
                  rotate: 360,
                  backgroundColor: '#88a978',
                  transition: { duration: 0.5 },
                }}
              >
                <FaLeaf color="#f0f5f0" size={24} />
              </motion.div>
              <h3 className="text-xl font-inter font-semibold text-[#f0f5f0] mb-2">
                Seamless Product Scanning
              </h3>
              <p className="text-base font-inter text-[#d9e2d9]">
                Scan products with a single click to uncover their sustainability metrics.
              </p>
            </motion.div>
            {/* Card 3: Detailed Sustainability Insights */}
            <motion.div
              className="flex-1 p-6 bg-gradient-to-br from-[#506850]/90 to-[#3b5f3b]/90 border border-[#6e8f6e]/60 rounded-lg shadow-md hover:shadow-lg hover:shadow-[#88a978]/40 transition-all duration-300"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: 0.6 }}
              whileHover={{
                scale: 1.05,
                borderColor: '#88a978',
                transition: { duration: 0.3 },
              }}
            >
              <motion.div
                className="flex items-center justify-center w-12 h-12 bg-[#88a978]/30 rounded-full mb-4"
                whileHover={{
                  rotate: 360,
                  backgroundColor: '#88a978',
                  transition: { duration: 0.5 },
                }}
              >
                <FaChartBar color="#f0f5f0" size={24} />
              </motion.div>
              <h3 className="text-xl font-inter font-semibold text-[#f0f5f0] mb-2">
                Detailed Sustainability Insights
              </h3>
              <p className="text-base font-inter text-[#d9e2d9]">
                Access in-depth metrics like sustainability scores, carbon footprint, and materials breakdown.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
};

export default FeaturesAndStats;