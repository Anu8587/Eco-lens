import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../Navbar/Navbar';
import heroImage from '../../assets/hero.png';
import { useState } from 'react';

export default function StoryHero() {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [formMode, setFormMode] = useState('url'); // 'url' or 'description'

  const headlineWords = [
    { text: 'Uncover', color: '#233623' },
    { text: 'the', color: '#2e472e' },
    { text: 'Eco', color: '#3b5f3b' },
    { text: 'Impact', color: '#4a774a' },
    { text: 'of', color: '#233623' },
    { text: 'Your', color: '#2e472e' },
    { text: 'Products', color: '#3b5f3b' },
  ];

  const handleGetStartedClick = () => {
    setIsFormVisible(true);
  };

  const handleCloseClick = () => {
    setIsFormVisible(false);
  };

  return (
    <section id="home" className="relative bg-gradient-to-b from-[#f3f6f3] to-[#6e8f6e]/20 flex flex-col overflow-hidden">
      {/* Navbar */}
      <Navbar />
      {/* Background Leaves */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <svg
            key={i}
            className="absolute text-[#6e8f6e]/80"
            style={{
              width: `30px`,
              height: `30px`,
              top: `${Math.random() * 50}%`,
              left: `${Math.random() * 100}%`,
              animation: `fall 20s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`,
              transform: `rotate(${Math.random() * 360}deg)`,
              opacity: `0.5`,
            }}
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 3C12 3 9 6 9 9C9 12 12 15 12 15C12 15 15 12 15 9C15 6 12 3 12 3Z" />
          </svg>
        ))}
      </div>
      {/* Main Content */}
      <div className="flex-1 flex flex-col px-10 md:px-24 py-10">
        {/* Text and Image Row */}
        <div className="flex flex-col md:flex-row items-center justify-between">
          {/* Text Container */}
          <div className="relative z-10 w-full md:w-1/2 flex flex-col justify-center gap-6">
            <motion.h1
              className="text-4xl md:text-5xl font-inter font-bold leading-tight tracking-tight flex flex-wrap gap-2"
            >
              {headlineWords.map((word, index) => (
                <motion.span
                  key={index}
                  className={`text-[${word.color}]`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, ease: 'easeOut', delay: index * 0.1 }}
                >
                  {word.text}
                </motion.span>
              ))}
            </motion.h1>
            {/* Subheadline */}
            <motion.p
              className="text-lg md:text-xl font-inter text-[#2f3b2f] max-w-md"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut', delay: 0.8 }}
            >
              Discover Sustainable Insights with Ease.
            </motion.p>
            {/* CTA Button */}
            <motion.button
              onClick={handleGetStartedClick}
              className="mt-4 w-[128px] h-[44px] bg-transparent text-[#3b5f3b] font-inter font-medium text-sm rounded-sm border border-[#3b5f3b] hover:bg-[#6e8f6e] hover:text-[#f0f5f0] hover:border-[#6e8f6e] focus:outline-none focus:ring-2 focus:ring-[#6e8f6e]/40"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut', delay: 1.0 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Get Started
            </motion.button>
          </div>
          {/* Image (Right Side) */}
          <div className="hidden md:flex w-1/2 h-full items-center justify-end">
            <motion.img
              src={heroImage}
              alt="EcoLens Hero"
              className="w-4/5 h-auto object-contain"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: 0.4 }}
            />
          </div>
        </div>
        {/* Input Form (Below Text and Image) */}
        <AnimatePresence>
          {isFormVisible && (
            <motion.div
              className="mt-6 flex justify-center"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            >
              <div className="relative w-full max-w-lg p-10 bg-[#6e8f6e]/20 bg-gradient-to-b from-[#f3f6f3]/70 to-[#6e8f6e]/30 backdrop-blur-md border border-[#6e8f6e]/40 rounded-lg shadow-sm flex flex-col gap-6">
                {/* Close Button */}
                <motion.button
                  onClick={handleCloseClick}
                  className="absolute top-4 right-4 w-8 h-8 bg-[#6e8f6e] text-[#f0f5f0] font-inter font-medium text-lg rounded-full flex items-center justify-center hover:bg-[#88a978] focus:outline-none focus:ring-2 focus:ring-[#88a978]/40 transition-all duration-300"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  ×
                </motion.button>
                {/* Title and Description */}
                <motion.div
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: 'easeOut', delay: 0.1 }}
                >
                  <h2 className="text-3xl font-inter font-bold text-[#233623] tracking-wide">
                    EcoLens
                  </h2>
                  <p className="text-base font-inter text-[#233623]/80 mt-1 leading-relaxed">
                    Enter a product URL or description to uncover its eco-impact.
                  </p>
                </motion.div>
                {/* Slider Toggle */}
                <motion.div
                  className="relative flex justify-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: 'easeOut', delay: 0.2 }}
                >
                  <div className="relative w-64 bg-[#f3f6f3]/50 border border-[#3b5f3b]/50 rounded-full flex items-center justify-between p-1">
                    {/* Sliding Background */}
                    <motion.div
                      className="absolute top-1 bottom-1 w-1/2 bg-[#6e8f6e] rounded-full shadow-sm shadow-[#6e8f6e]/40"
                      initial={false}
                      animate={{ x: formMode === 'url' ? 0 : '100%' }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                    />
                    {/* Toggle Options */}
                    <button
                      type="button"
                      onClick={() => setFormMode('url')}
                      className={`relative z-10 w-1/2 text-sm font-inter font-medium py-1.5 rounded-full transition-colors duration-300 ${
                        formMode === 'url' ? 'text-[#f0f5f0]' : 'text-[#233623]'
                      }`}
                    >
                      Enter URL
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormMode('description')}
                      className={`relative z-10 w-1/2 text-sm font-inter font-medium py-1.5 rounded-full transition-colors duration-300 ${
                        formMode === 'description' ? 'text-[#f0f5f0]' : 'text-[#233623]'
                      }`}
                    >
                      Describe Product
                    </button>
                  </div>
                </motion.div>
                {/* Form */}
                <form
                  className="flex flex-col gap-6"
                  onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.target);
                    console.log({
                      link: formData.get('productLink'),
                      description: formData.get('productDescription'),
                    });
                  }}
                >
                  {formMode === 'url' ? (
                    <motion.input
                      type="text"
                      name="productLink"
                      placeholder="Paste product link (e.g., Amazon URL)"
                      className="px-4 py-3 text-[#2f3b2f] font-inter text-lg bg-gradient-to-b from-[#f3f6f3]/60 to-[#e8f0e8]/50 rounded-sm border border-[#3b5f3b] placeholder-[#4a664a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#88a978]/40 focus:border-[#88a978] hover:border-[#88a978] transition-all duration-300"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, ease: 'easeOut', delay: 0.3 }}
                    />
                  ) : (
                    <motion.textarea
                      name="productDescription"
                      placeholder="Describe the product (e.g., a cotton t-shirt made in India)"
                      rows="4"
                      className="px-4 py-3 text-[#2f3b2f] font-inter text-lg bg-gradient-to-b from-[#f3f6f3]/60 to-[#e8f0e8]/50 rounded-sm border border-[#3f5f3b] placeholder-[#4a664a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#88a978]/40 focus:border-[#88a978] hover:border-[#88a978] resize-none transition-all duration-300"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, ease: 'easeOut', delay: 0.3 }}
                    />
                  )}
                  {/* Submit Button */}
                  <motion.button
                    type="submit"
                    className="px-6 py-2.5 bg-gradient-to-r from-[#6e8f6e] to-[#88a978] text-[#f0f5f0] font-inter font-medium text-base rounded-sm border border-[#6e8f6e] hover:from-[#88a978] hover:to-[#a8c7a8] hover:border-[#88a978] hover:shadow-lg hover:shadow-[#88a978]/50 focus:outline-none focus:ring-2 focus:ring-[#88a978]/40 transition-all duration-300"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: 'easeOut', delay: 0.4 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Submit
                  </motion.button>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}