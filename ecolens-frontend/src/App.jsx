// src/App.jsx
import { useState } from 'react';
import StoryHero from './components/Hero/StoryHero';
import ExtensionPromo from './components/ExtensionPromo';
import FeaturesAndStats from './components/FeaturesAndStats';
import { motion } from 'framer-motion';
import { FaTwitter, FaInstagram, FaLinkedin, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

function App() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);

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

  return (
    <div className="App bg-gradient-to-b from-[#d9e2d9] to-[#506850]/40 min-h-screen flex flex-col">
      {/* Hero Section */}
      <section id="home">
        <StoryHero />
      </section>

      {/* Extension Promo and Banner Image Sections */}
      <ExtensionPromo />

      {/* Features and Stats Sections */}
      <section id="features">
        <FeaturesAndStats />
      </section>

      {/* Enhanced Contact Section */}
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
            className="text-3xl md:text-4xl font-inter font-bold text-[#f0f5f0] text-center mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Get in Touch
          </motion.h2>
          <motion.p
            className="text-lg font-inter text-[#f0f5f0]/80 text-center mb-10 max-w-2xl mx-auto"
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
                  className="text-[#88a978] font-inter font-semibold text-lg text-center"
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
                    <label htmlFor="name" className="block text-[#1a2c1a] font-inter font-medium mb-1">
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
                    <label htmlFor="email" className="block text-[#1a2c1a] font-inter font-medium mb-1">
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
                    <label htmlFor="message" className="block text-[#1a2c1a] font-inter font-medium mb-1">
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
                    className="w-full px-6 py-2 bg-[#88a978] text-[#f0f5f0] rounded-md font-inter font-medium hover:bg-[#9bb989] transition-colors"
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
              <h3 className="text-xl font-inter font-bold mb-4">Contact Information</h3>
              <ul className="space-y-3 text-sm font-inter">
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

      {/* Newsletter Signup Section */}
      <section id="newsletter" className="py-16 px-10 md:px-24 bg-[#f0f5f0] text-center">
        <motion.h2
          className="text-3xl md:text-4xl font-inter font-bold text-[#1a2c1a] mb-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Join Our Newsletter
        </motion.h2>
        <motion.p
          className="text-lg font-inter text-[#2f3b2f] mb-6 max-w-xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Stay updated with the latest sustainability tips and EcoLens news.
        </motion.p>
        {isSubscribed ? (
          <motion.div
            className="text-[#88a978] font-inter font-semibold text-lg"
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
              className="px-6 py-2 bg-[#88a978] text-[#f0f5f0] rounded-r-md font-inter font-medium hover:bg-[#9bb989] transition-colors"
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

      {/* Modern Footer */}
      <footer className="bg-gradient-to-r from-[#506850] to-[#88a978] text-[#f0f5f0] py-12 px-10 md:px-24">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-inter font-bold mb-4">EcoLens</h3>
            <p className="text-sm font-inter">
              Empowering sustainable choices with transparency and ease. Join us in making a greener future.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-inter font-bold mb-4">Contact Us</h3>
            <ul className="space-y-2 text-sm font-inter">
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
            <h3 className="text-xl font-inter font-bold mb-4">Follow Us</h3>
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
          <p className="text-sm font-inter">© 2025 EcoLens. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;