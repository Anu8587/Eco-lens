// src/components/FeaturesAndStats.jsx
import { motion } from 'framer-motion';
import { FaSearch, FaLeaf, FaChartBar, FaUsers } from 'react-icons/fa';
import { useState, useEffect } from 'react';

const FeaturesAndStats = () => {
  const [statsInView, setStatsInView] = useState(false);
  const [productsAnalyzed, setProductsAnalyzed] = useState(0);
  const [usersMakingGreenerChoices, setUsersMakingGreenerChoices] = useState(0);
  const [usersEducated, setUsersEducated] = useState(0);

  // Counter animation for stats when the section comes into view
  useEffect(() => {
    if (statsInView) {
      const productsInterval = setInterval(() => {
        setProductsAnalyzed((prev) => (prev < 200 ? prev + 4 : 200));
      }, 20);
      const greenerChoicesInterval = setInterval(() => {
        setUsersMakingGreenerChoices((prev) => (prev < 25 ? prev + 1 : 25));
      }, 60);
      const usersEducatedInterval = setInterval(() => {
        setUsersEducated((prev) => (prev < 300 ? prev + 6 : 300));
      }, 40);

      return () => {
        clearInterval(productsInterval);
        clearInterval(greenerChoicesInterval);
        clearInterval(usersEducatedInterval);
      };
    }
  }, [statsInView]);

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
            {/* Card 1: Real-Time Eco-Impact Analysis */}
            <motion.div
              className="flex-1 p-6 bg-[#e8f0e8]/80 border border-[#6e8f6e]/40 rounded-lg shadow-lg"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
            >
              <div className="flex items-center justify-center w-12 h-12 bg-[#88a978]/20 rounded-full mb-4">
                <FaSearch color="#506850" size={24} />
              </div>
              <h3 className="text-xl font-inter font-semibold text-[#1a2c1a] mb-2">
                Real-Time Eco-Impact Analysis
              </h3>
              <p className="text-base font-inter text-[#2f3b2f]">
                Get instant insights into the environmental impact of products while you shop online.
              </p>
            </motion.div>
            {/* Card 2: Seamless Product Scanning */}
            <motion.div
              className="flex-1 p-6 bg-[#d9e2d9]/80 border border-[#6e8f6e]/40 rounded-lg shadow-lg"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: 0.4 }}
            >
              <div className="flex items-center justify-center w-12 h-12 bg-[#88a978]/20 rounded-full mb-4">
                <FaLeaf color="#506850" size={24} />
              </div>
              <h3 className="text-xl font-inter font-semibold text-[#1a2c1a] mb-2">
                Seamless Product Scanning
              </h3>
              <p className="text-base font-inter text-[#2f3b2f]">
                Scan products with a single click to uncover their sustainability metrics.
              </p>
            </motion.div>
            {/* Card 3: Detailed Sustainability Insights */}
            <motion.div
              className="flex-1 p-6 bg-[#c8d8c8]/80 border border-[#6e8f6e]/40 rounded-lg shadow-lg"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: 0.6 }}
            >
              <div className="flex items-center justify-center w-12 h-12 bg-[#88a978]/20 rounded-full mb-4">
                <FaChartBar color="#506850" size={24} />
              </div>
              <h3 className="text-xl font-inter font-semibold text-[#1a2c1a] mb-2">
                Detailed Sustainability Insights
              </h3>
              <p className="text-base font-inter text-[#2f3b2f]">
                Access in-depth metrics like sustainability scores, carbon footprint, and materials breakdown.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative py-12 px-10 md:px-24">
        <div className="relative z-10 max-w-5xl mx-auto">
          <motion.h2
            className="text-3xl md:text-4xl font-inter font-bold text-[#1a2c1a] text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            Our Impact
          </motion.h2>
          <motion.div
            className="flex flex-col md:flex-row gap-8 justify-center items-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            onViewportEnter={() => setStatsInView(true)}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            {/* Stat 1: Products Analyzed */}
            <div className="flex flex-col items-center text-center">
              <div className="text-4xl mb-2">♻️</div>
              <p className="text-2xl font-inter font-bold text-[#1a2c1a]">{productsAnalyzed}+</p>
              <p className="text-base font-inter text-[#2f3b2f]">Products Analyzed</p>
            </div>
            {/* Stat 2: Users Making Greener Choices */}
            <div className="flex flex-col items-center text-center">
              <div className="text-4xl mb-2">🌱</div>
              <p className="text-2xl font-inter font-bold text-[#1a2c1a]">{usersMakingGreenerChoices}%</p>
              <p className="text-base font-inter text-[#2f3b2f]">Users Making Greener Choices</p>
            </div>
            {/* Stat 3: Users Educated on Sustainability */}
            <div className="flex flex-col items-center text-center">
              <div className="text-4xl mb-2">🌍</div>
              <p className="text-2xl font-inter font-bold text-[#1a2c1a]">{usersEducated}+</p>
              <p className="text-base font-inter text-[#2f3b2f]">Users Educated on Sustainability</p>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default FeaturesAndStats;