import { useState } from 'react';
import StoryHero from './components/Hero/StoryHero'; // Adjusted path based on previous setup
import ExtensionPromo from './components/ExtensionPromo';
import MetricsExplained from './components/MetricsExplained'; // New component import
import FeaturesAndStats from './components/FeaturesAndStats';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTwitter, FaInstagram, FaLinkedin, FaEnvelope, FaPhone, FaMapMarkerAlt, FaArrowLeft, FaArrowRight, FaUserCircle, FaAward, FaChevronDown, FaChevronUp, FaLeaf } from 'react-icons/fa';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [currentChampion, setCurrentChampion] = useState(0);
  const [openDropdown, setOpenDropdown] = useState(null); // State for dropdown toggle

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setEmail('');
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.message) {
      setIsSubmitted(true);
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setIsSubmitted(false), 3000);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Sample Eco Champions data with additional details for dropdown
  const ecoChampions = [
    {
      name: "Sarah Green",
      bio: "A sustainability advocate who reduced her carbon footprint by 40% through zero-waste living.",
      stat: "Saved 500 kg of CO2",
      statValue: 500, // For visualization (out of 1000 kg goal)
      statGoal: 1000,
      details: "Sarah started her journey by adopting a zero-waste lifestyle, eliminating single-use plastics, and composting all organic waste. She also educates her community through workshops.",
    },
    {
      name: "Eco Warriors Group",
      bio: "A community group planting trees and organizing clean-up drives in their city.",
      stat: "Planted 1,000 trees",
      statValue: 1000, // For visualization (out of 2000 trees goal)
      statGoal: 2000,
      details: "The Eco Warriors have transformed urban spaces by planting trees and cleaning up local parks. They’ve also partnered with schools to teach kids about environmental care.",
    },
    {
      name: "Michael Brooks",
      bio: "A cyclist promoting eco-friendly commuting and reducing urban air pollution.",
      stat: "Reduced 300 kg of emissions",
      statValue: 300, // For visualization (out of 500 kg goal)
      statGoal: 500,
      details: "Michael campaigns for better cycling infrastructure in his city and has inspired over 200 people to switch to biking for their daily commute.",
    },
  ];

  // Handle carousel navigation
  const handleNextChampion = () => {
    setCurrentChampion((prev) => (prev + 1) % ecoChampions.length);
    setOpenDropdown(null); // Close dropdown when switching champions
  };

  const handlePrevChampion = () => {
    setCurrentChampion((prev) => (prev - 1 + ecoChampions.length) % ecoChampions.length);
    setOpenDropdown(null); // Close dropdown when switching champions
  };

  // Toggle dropdown
  const toggleDropdown = (index) => {
    setOpenDropdown(openDropdown === index ? null : index);
  };

  return (
    <div className="App bg-gradient-to-b from-[#d9e2d9] to-[#506850]/40 min-h-screen flex flex-col">
      <ErrorBoundary>
        <section id="home">
          <StoryHero />
        </section>

        <ExtensionPromo />

        {/* Metrics Explained Section */}
        <section id="metrics-explained">
          <MetricsExplained />
        </section>

        <section id="features">
          <FeaturesAndStats />
        </section>

        {/* Community Spotlight Section */}
        <section
          id="community"
          className="relative py-16 px-10 md:px-24 bg-gradient-to-r from-[#d9e2d9] to-[#f0f5f0] overflow-hidden"
        >
          {/* Background Leaves */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(20)].map((_, i) => (
              <svg
                key={i}
                className="absolute text-[#506850]/10"
                style={{
                  width: `15px`,
                  height: `15px`,
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  animation: `fall 15s ease-in-out infinite`,
                  animationDelay: `${Math.random() * 8}s`,
                  transform: `rotate(${Math.random() * 360}deg)`,
                  opacity: `0.3`,
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
              className="text-3xl md:text-4xl font-poppins font-bold text-[#1a2c1a] text-center mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              Community Spotlight
            </motion.h2>
            <motion.p
              className="text-lg font-poppins text-[#2f3b2f] text-center mb-10 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Meet our Eco Champions making a difference in sustainability!
            </motion.p>

            {/* Carousel */}
            <div className="relative">
              <motion.div
                key={currentChampion}
                className="flex justify-center"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5 }}
              >
                <div className="bg-[#f0f5f0] p-6 rounded-lg shadow-lg max-w-sm w-full text-center carousel-card">
                  {/* Champion Icon with Badge */}
                  <div className="relative inline-block">
                    <FaUserCircle className="w-24 h-24 text-[#88a978] mx-auto mb-4" />
                    <FaAward className="absolute bottom-4 right-0 w-8 h-8 text-[#d4e157]" />
                  </div>

                  <h3 className="text-xl font-poppins font-semibold text-[#1a2c1a] mb-2">
                    {ecoChampions[currentChampion]?.name || 'Unknown Champion'}
                  </h3>
                  <p className="text-sm font-poppins text-[#2f3b2f] mb-3">
                    {ecoChampions[currentChampion]?.bio || 'No bio available.'}
                  </p>

                  {/* Stat with Icon and Visualization */}
                  <div className="flex items-center justify-center mb-4">
                    <FaLeaf className="w-5 h-5 text-[#88a978] mr-2" />
                    <p className="text-sm font-poppins font-medium text-[#88a978]">
                      {ecoChampions[currentChampion]?.stat || 'No stats available.'}
                    </p>
                  </div>

                  {/* Circular Progress Visualization */}
                  <div className="relative w-24 h-24 mx-auto mb-4">
                    <svg className="w-full h-full" viewBox="0 0 36 36">
                      <path
                        d="M18 2.0845
                          a 15.9155 15.9155 0 0 1 0 31.831
                          a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#e0e0e0"
                        strokeWidth="3"
                      />
                      <path
                        d="M18 2.0845
                          a 15.9155 15.9155 0 0 1 0 31.831
                          a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#88a978"
                        strokeWidth="3"
                        strokeDasharray={`${(ecoChampions[currentChampion]?.statValue / ecoChampions[currentChampion]?.statGoal) * 100 || 0}, 100`}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-sm font-poppins text-[#1a2c1a]">
                        {Math.round((ecoChampions[currentChampion]?.statValue / ecoChampions[currentChampion]?.statGoal) * 100) || 0}%
                      </span>
                    </div>
                  </div>

                  {/* Dropdown Toggle */}
                  <button
                    onClick={() => toggleDropdown(currentChampion)}
                    className="flex items-center justify-center mx-auto text-[#88a978] hover:text-[#9bb989] transition-colors"
                  >
                    <span className="text-sm font-poppins mr-2">
                      {openDropdown === currentChampion ? 'Hide Details' : 'Show Details'}
                    </span>
                    {openDropdown === currentChampion ? (
                      <FaChevronUp className="w-4 h-4" />
                    ) : (
                      <FaChevronDown className="w-4 h-4" />
                    )}
                  </button>

                  {/* Dropdown Content */}
                  <AnimatePresence>
                    {openDropdown === currentChampion && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mt-4 text-sm font-poppins text-[#2f3b2f]"
                      >
                        {ecoChampions[currentChampion]?.details || 'No additional details available.'}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>

              {/* Navigation Arrows */}
              <button
                onClick={handlePrevChampion}
                className="absolute left-0 top-1/2 transform -translate-y-1/2 p-3 bg-[#88a978] text-[#f0f5f0] rounded-full hover:bg-[#9bb989] transition-colors"
              >
                <FaArrowLeft size={24} />
              </button>
              <button
                onClick={handleNextChampion}
                className="absolute right-0 top-1/2 transform -translate-y-1/2 p-3 bg-[#88a978] text-[#f0f5f0] rounded-full hover:bg-[#9bb989] transition-colors"
              >
                <FaArrowRight size={24} />
              </button>
            </div>
          </div>
        </section>

        <section
          id="contact"
          className="relative py-16 px-10 md:px-24 bg-gradient-to-r from-[#506850] to-[#88a978] overflow-hidden"
        >
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(30)].map((_, i) => (
              <svg
                key={i}
                className="absolute text-[#f0f5f0]/20"
                style={{
                  width: `15px`,
                  height: `15px`,
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  animation: `fall 15s ease-in-out infinite`,
                  animationDelay: `${Math.random() * 8}s`,
                  transform: `rotate(${Math.random() * 360}deg)`,
                  opacity: `0.3`,
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
              className="text-3xl md:text-4xl font-poppins font-bold text-[#f0f5f0] text-center mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              Get in Touch
            </motion.h2>
            <motion.p
              className="text-lg font-poppins text-[#f0f5f0]/80 text-center mb-10 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Have questions or feedback? Reach out to our team—we’d love to hear from you!
            </motion.p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <motion.div
                className="bg-[#f0f5f0] p-6 rounded-lg shadow-lg"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                {isSubmitted ? (
                  <motion.div
                    className="text-[#88a978] font-poppins font-semibold text-lg text-center"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    Message sent successfully! 🌿 We’ll get back to you soon.
                  </motion.div>
                ) : (
                  <form onSubmit={handleContactSubmit}>
                    <motion.div
                      className="mb-4"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: 0.2 }}
                    >
                      <label htmlFor="name" className="block text-[#1a2c1a] font-poppins font-medium mb-1">
                        Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 rounded-md border border-[#88a978]/60 text-[#2f3b2f] focus:outline-none focus:ring-2 focus:ring-[#88a978]/40"
                        placeholder="Your name"
                        required
                      />
                    </motion.div>
                    <motion.div
                      className="mb-4"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: 0.3 }}
                    >
                      <label htmlFor="email" className="block text-[#1a2c1a] font-poppins font-medium mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 rounded-md border border-[#88a978]/60 text-[#2f3b2f] focus:outline-none focus:ring-2 focus:ring-[#88a978]/40"
                        placeholder="Your email"
                        required
                      />
                    </motion.div>
                    <motion.div
                      className="mb-4"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: 0.4 }}
                    >
                      <label htmlFor="message" className="block text-[#1a2c1a] font-poppins font-medium mb-1">
                        Message
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 rounded-md border border-[#88a978]/60 text-[#2f3b2f] focus:outline-none focus:ring-2 focus:ring-[#88a978]/40 resize-y"
                        placeholder="Your message"
                        rows="4"
                        required
                      ></textarea>
                    </motion.div>
                    <motion.button
                      type="submit"
                      className="w-full px-6 py-2 bg-[#88a978] text-[#f0f5f0] rounded-md font-poppins font-medium hover:bg-[#9bb989] transition-colors"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: 0.5 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Send Message
                    </motion.button>
                  </form>
                )}
              </motion.div>

              <motion.div
                className="flex flex-col justify-center text-[#f0f5f0]"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h3 className="text-xl font-poppins font-bold mb-4">Contact Information</h3>
                <ul className="space-y-3 text-sm font-poppins">
                  <li className="flex items-center">
                    <FaEnvelope className="mr-2" />
                    <a href="mailto:support@ecolens.com" className="hover:text-[#d4e157] transition-colors">
                      support@ecolens.com
                    </a>
                  </li>
                  <li className="flex items-center">
                    <FaPhone className="mr-2" />
                    <a href="tel:+1234567890" className="hover:text-[#d4e157] transition-colors">
                      +1 (234) 567-890
                    </a>
                  </li>
                  <li className="flex items-center">
                    <FaMapMarkerAlt className="mr-2" />
                    <span>123 Green Street, Eco City, Earth</span>
                  </li>
                </ul>
              </motion.div>
            </div>
          </div>
        </section>

        <section id="newsletter" className="py-16 px-10 md:px-24 bg-[#f0f5f0] text-center">
          <motion.h2
            className="text-3xl md:text-4xl font-poppins font-bold text-[#1a2c1a] mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Join Our Newsletter
          </motion.h2>
          <motion.p
            className="text-lg font-poppins text-[#2f3b2f] mb-6 max-w-xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Stay updated with the latest sustainability tips and EcoLens news.
          </motion.p>
          {isSubscribed ? (
            <motion.div
              className="text-[#88a978] font-poppins font-semibold text-lg"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              Thanks for subscribing! 🌿
            </motion.div>
          ) : (
            <div className="flex justify-center">
              <motion.input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="px-4 py-2 w-full max-w-sm rounded-l-md border border-[#88a978]/60 text-[#2f3b2f] focus:outline-none focus:ring-2 focus:ring-[#88a978]/40"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
              />
              <motion.button
                onClick={handleSubscribe}
                className="px-6 py-2 bg-[#88a978] text-[#f0f5f0] rounded-r-md font-poppins font-medium hover:bg-[#9bb989] transition-colors"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Subscribe
              </motion.button>
            </div>
          )}
        </section>

        <footer className="bg-gradient-to-r from-[#506850] to-[#88a978] text-[#f0f5f0] py-12 px-10 md:px-24">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-poppins font-bold mb-4">EcoLens</h3>
              <p className="text-sm font-poppins">
                Empowering sustainable choices with transparency and ease. Join us in making a greener future.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-poppins font-bold mb-4">Contact Us</h3>
              <ul className="space-y-2 text-sm font-poppins">
                <li className="flex items-center">
                  <FaEnvelope className="mr-2" />
                  <a href="mailto:support@ecolens.com" className="hover:text-[#d4e157] transition-colors">
                    support@ecolens.com
                  </a>
                </li>
                <li className="flex items-center">
                  <FaPhone className="mr-2" />
                  <a href="tel:+1234567890" className="hover:text-[#d4e157] transition-colors">
                    +1 (234) 567-890
                  </a>
                </li>
                <li className="flex items-center">
                  <FaMapMarkerAlt className="mr-2" />
                  <span>123 Green Street, Eco City, Earth</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-poppins font-bold mb-4">Follow Us</h3>
              <div className="flex space-x-4">
                <a
                  href="https://twitter.com/ecolens"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#f0f5f0] hover:text-[#d4e157] transition-colors"
                >
                  <FaTwitter size={24} />
                </a>
                <a
                  href="https://instagram.com/ecolens"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#f0f5f0] hover:text-[#d4e157] transition-colors"
                >
                  <FaInstagram size={24} />
                </a>
                <a
                  href="https://linkedin.com/company/ecolens"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#f0f5f0] hover:text-[#d4e157] transition-colors"
                >
                  <FaLinkedin size={24} />
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-[#f0f5f0]/20 mt-8 pt-4 text-center">
            <p className="text-sm font-poppins">© 2025 EcoLens. All rights reserved.</p>
          </div>
        </footer>
      </ErrorBoundary>

      {/* Define the `fall` animation keyframes and add pulse animation for MetricsExplained */}
      <style>{`
        @keyframes fall {
          0% {
            transform: translateY(-100vh) rotate(0deg);
            opacity: 0.3;
          }
          100% {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0.1;
          }
        }
        @keyframes pulse {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.05);
            opacity: 0.7;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>

      {/* Load Fonts (Poppins, Inter, and Playfair Display) */}
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&family=Inter:wght@400;500;600;700&family=Playfair+Display:ital@1&display=swap" />
    </div>
  );
}

export default App;