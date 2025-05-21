// src/App.jsx
import StoryHero from './components/Hero/StoryHero';
import ExtensionPromo from './components/ExtensionPromo';
import FeaturesAndStats from './components/FeaturesAndStats';
import { motion } from 'framer-motion';

function App() {
  return (
    <div className="App bg-gradient-to-b from-[#d9e2d9] to-[#506850]/40 min-h-screen flex flex-col">
      {/* Hero Section */}
      <StoryHero />

      {/* Extension Promo and Banner Image Sections */}
      <ExtensionPromo />

      {/* Features and Stats Sections */}
      <FeaturesAndStats />

      {/* Main Sections */}
      {/* About Section */}
      <section
        id="about"
        className="relative min-h-[500px] flex items-center justify-center py-16 px-10 md:px-24 overflow-hidden"
      >
        {/* Background Leaves for Visual Appeal */}
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
        <div className="relative z-10 max-w-2xl w-full text-center">
          <motion.h2
            className="text-3xl md:text-4xl font-inter font-bold text-[#1a2c1a] mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            About EcoLens
          </motion.h2>
          <motion.p
            className="text-lg font-inter text-[#2f3b2f] mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
          >
            EcoLens is your go-to platform for understanding the environmental impact of the products you love. We’re passionate about empowering consumers to make sustainable choices with ease and transparency.
          </motion.p>
          <motion.button
            className="px-6 py-2 bg-transparent text-[#3b5f3b] font-inter font-medium text-base rounded-sm border border-[#3b5f3b] hover:bg-[#6e8f6e] hover:text-[#f0f5f0] hover:border-[#6e8f6e] focus:outline-none focus:ring-2 focus:ring-[#6e8f6e]/40 transition-all duration-300"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.4 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Learn More
          </motion.button>
        </div>
      </section>

      {/* Contact Section */}
      <section
        id="contact"
        className="relative min-h-[500px] flex items-center justify-center py-16 px-10 md:px-24 overflow-hidden"
      >
        {/* Background Leaves for Visual Appeal */}
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
        <div className="relative z-10 max-w-2xl w-full text-center">
          <motion.h2
            className="text-3xl md:text-4xl font-inter font-bold text-[#1a2c1a] mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            Get in Touch
          </motion.h2>
          <motion.p
            className="text-lg font-inter text-[#2f3b2f] mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
          >
            Have questions or feedback? We’d love to hear from you! Reach out to our team and let’s make sustainability a shared journey.
          </motion.p>
          <motion.button
            className="px-6 py-2 bg-gradient-to-r from-[#506850] to-[#88a978] text-[#f0f5f0] font-inter font-medium text-base rounded-sm border border-[#6e8f6e] hover:from-[#88a978] hover:to-[#a8c7a8] hover:border-[#88a978] hover:shadow-lg hover:shadow-[#88a978]/50 focus:outline-none focus:ring-2 focus:ring-[#88a978]/40 transition-all duration-300"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.4 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Contact Us
          </motion.button>
        </div>
      </section>
    </div>
  );
}

export default App;