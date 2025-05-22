import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../Navbar/Navbar';
import heroImage from '../../assets/hero.png';
import { useState } from 'react';
import { FaLeaf, FaCheck, FaRecycle, FaWater, FaBolt, FaChartPie, FaLightbulb, FaCogs } from 'react-icons/fa';
import axios from 'axios';

const StoryHero = () => {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [formMode, setFormMode] = useState('url'); // 'url' or 'description'
  const [report, setReport] = useState(null); // Store AI-generated report data
  const [error, setError] = useState(null); // Store validation errors
  const [savedTip, setSavedTip] = useState(false); // Track if eco tip is saved

  const headlineWords = [
    { text: 'Uncover', color: '#1a2c1a' },
    { text: 'the', color: '#2e472e' },
    { text: 'Eco', color: '#3b5f3b' },
    { text: 'Impact', color: '#4a774a' },
    { text: 'of', color: '#1a2c1a' },
    { text: 'Your', color: '#2e472e' },
    { text: 'Products', color: '#3b5f3b' },
  ];

  const dashboardTitleWords = [
    { text: 'EcoLens', color: '#1a2c1a' },
    { text: 'Sustainability', color: '#2e472e' },
    { text: 'Report', color: '#3b5f3b' },
  ];

  const handleGetStartedClick = () => {
    setIsFormVisible(true);
  };

  const handleCloseClick = () => {
    setIsFormVisible(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const input = formMode === 'url' ? formData.get('productLink') : formData.get('productDescription');

    // Basic validation
    if (!input || input.trim() === '') {
      setError(formMode === 'url' ? 'Please enter a valid URL' : 'Please enter a product description');
      return;
    }
    if (formMode === 'url' && !input.startsWith('http')) {
      setError('Please enter a valid URL starting with http:// or https://');
      return;
    }

    setError(null);
    try {
      const response = await axios.post('http://localhost:5000/api/analyze', {
        productLink: formMode === 'url' ? input : '',
        productDescription: formMode === 'description' ? input : '',
      });
      console.log('API Response:', response.data); // Debug log
      setReport(response.data);
      setIsFormVisible(false);
    } catch (err) {
      console.error('API Error:', err); // Debug log
      setError(err.response?.data?.error || 'Failed to analyze the product. Please try again.');
      setReport(null); // Reset report on error
    }
  };

  // Helper to determine environment impact
  const getEnvironmentImpact = (score) => {
    if (score >= 7) return { label: 'Good for Environment', color: '#88a978' };
    if (score <= 3) return { label: 'Bad for Environment', color: '#f4a261' };
    return { label: 'Moderate for Environment', color: '#d4b83e' };
  };

  // Fallback UI for when report is invalid
  const renderErrorState = () => (
    <div className="text-center p-6 bg-[#f4a261]/20 rounded-lg">
      <p className="text-[#f4a261] text-lg font-inter">
        Oops! Something went wrong while generating the report.
      </p>
      <p className="text-[#2f3b2f] text-sm mt-2">
        Please try again or enter a different product.
      </p>
      <button
        onClick={() => {
          setReport(null);
          setIsFormVisible(true);
          setSavedTip(false);
        }}
        className="mt-4 px-6 py-2 bg-[#506850] text-[#f0f5f0] font-inter font-medium text-base rounded-sm hover:bg-[#88a978] transition-all duration-300"
      >
        Try Again
      </button>
    </div>
  );

  return (
    <section id="home" className="relative bg-gradient-to-b from-[#d9e2d9] to-[#506850]/40 flex flex-col overflow-hidden">
      {/* Navbar */}
      <Navbar />
      {/* Background Leaves */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(100)].map((_, i) => (
          <svg
            key={i}
            className="absolute text-[#506850]/80"
            style={{
              width: `30px`,
              height: `30px`,
              top: `${Math.random() * 50}%`,
              left: `${Math.random() * 100}%`,
              animation: `fall 20s ease-in-out infinite`,
              animationDelay: `${Math.random() * 10}s`,
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
                  style={{ color: word.color }} // Use inline style instead of Tailwind class
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
        {/* Input Form (Appears First) */}
        <AnimatePresence>
          {isFormVisible && (
            <motion.div
              className="mt-6 flex justify-center"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            >
              <div className="relative w-full max-w-2xl p-10 bg-[#506850]/30 bg-gradient-to-b from-[#e8f0e8]/80 to-[#6e8f6e]/40 backdrop-blur-md border border-[#6e8f6e]/40 rounded-lg shadow-sm flex flex-col gap-6">
                {/* Close Button */}
                <motion.button
                  onClick={handleCloseClick}
                  className="absolute top-4 right-4 w-8 h-8 bg-[#506850] text-[#f0f5f0] font-inter font-medium text-lg rounded-full flex items-center justify-center hover:bg-[#88a978] focus:outline-none focus:ring-2 focus:ring-[#88a978]/40 transition-all duration-300"
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
                  <h2 className="text-3xl font-inter font-bold text-[#1a2c1a] tracking-wide">
                    EcoLens
                  </h2>
                  <p className="text-base font-inter text-[#2f3b2f] mt-1 leading-relaxed">
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
                  <div className="relative w-64 bg-[#e8f0e8]/80 border border-[#3b5f3b]/50 rounded-full flex items-center justify-between p-1">
                    {/* Sliding Background */}
                    <motion.div
                      className="absolute top-1 bottom-1 w-1/2 bg-[#506850] rounded-full shadow-sm shadow-[#6e8f6e]/40"
                      initial={false}
                      animate={{ x: formMode === 'url' ? 0 : '100%' }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                    />
                    {/* Toggle Options */}
                    <button
                      type="button"
                      onClick={() => setFormMode('url')}
                      className={`relative z-10 w-1/2 text-sm font-inter font-medium py-1.5 rounded-full transition-colors duration-300 ${
                        formMode === 'url' ? 'text-[#f0f5f0]' : 'text-[#1a2c1a]'
                      }`}
                    >
                      Enter URL
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormMode('description')}
                      className={`relative z-10 w-1/2 text-sm font-inter font-medium py-1.5 rounded-full transition-colors duration-300 ${
                        formMode === 'description' ? 'text-[#f0f5f0]' : 'text-[#1a2c1a]'
                      }`}
                    >
                      Describe Product
                    </button>
                  </div>
                </motion.div>
                {/* Form */}
                <form
                  className="flex flex-col gap-6"
                  onSubmit={handleSubmit}
                >
                  {formMode === 'url' ? (
                    <motion.input
                      type="text"
                      name="productLink"
                      placeholder="Paste product link (e.g., Amazon URL)"
                      className="px-4 py-3 text-[#1a2c1a] font-inter text-lg bg-gradient-to-b from-[#e8f0e8]/60 to-[#d9e2d9]/50 rounded-sm border border-[#3b5f3b] placeholder-[#4a664a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#88a978]/40 focus:border-[#88a978] hover:border-[#88a978] transition-all duration-300"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, ease: 'easeOut', delay: 0.3 }}
                    />
                  ) : (
                    <motion.textarea
                      name="productDescription"
                      placeholder="Describe the product (e.g., a cotton t-shirt made in India)"
                      rows="4"
                      className="px-4 py-3 text-[#1a2c1a] font-inter text-lg bg-gradient-to-b from-[#e8f0e8]/60 to-[#d9e2d9]/50 rounded-sm border border-[#3f5f3b] placeholder-[#4a664a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#88a978]/40 focus:border-[#88a978] hover:border-[#88a978] resize-none transition-all duration-300"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, ease: 'easeOut', delay: 0.3 }}
                    />
                  )}
                  {/* Error Message */}
                  {error && (
                    <motion.p
                      className="text-[#f4a261] text-sm text-center"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      {error}
                    </motion.p>
                  )}
                  {/* Submit Button */}
                  <motion.button
                    type="submit"
                    className="px-6 py-2.5 bg-gradient-to-r from-[#506850] to-[#88a978] text-[#f0f5f0] font-inter font-medium text-base rounded-sm border border-[#6e8f6e] hover:from-[#88a978] hover:to-[#a8c7a8] hover:border-[#88a978] hover:shadow-lg hover:shadow-[#88a978]/50 focus:outline-none focus:ring-2 focus:ring-[#88a978]/40 transition-all duration-300"
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
        {/* Eco Report Dashboard (Appears After Form Submission) */}
        {report && !isFormVisible ? (
          !report.sustainabilityScore || !report.impactMetrics ? (
            renderErrorState()
          ) : (
            <motion.div
              className="mt-6 flex justify-center"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            >
              <div className="w-full max-w-4xl">
                {/* Dashboard Title */}
                <motion.div
                  className="mb-2 text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <h2 className="text-2xl font-inter font-bold tracking-tight flex justify-center gap-2">
                    {dashboardTitleWords.map((word, index) => (
                      <motion.span
                        key={index}
                        style={{ color: word.color }} // Use inline style instead of Tailwind class
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, ease: 'easeOut', delay: index * 0.1 }}
                      >
                        {word.text}
                      </motion.span>
                    ))}
                  </h2>
                </motion.div>
                {/* Environment Impact Button */}
                <motion.div
                  className="mb-4 text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <div
                    className="inline-block px-4 py-1 rounded-full text-sm font-inter font-bold shadow-md"
                    style={{
                      backgroundColor: getEnvironmentImpact(report.sustainabilityScore.value).color,
                      color: '#ffffff',
                      border: `2px solid ${getEnvironmentImpact(report.sustainabilityScore.value).color}`,
                    }}
                  >
                    {getEnvironmentImpact(report.sustainabilityScore.value).label}
                  </div>
                </motion.div>
                {/* Summary (Subtitle) */}
                <motion.div
                  className="mb-4 text-center bg-[#f0f5f0]/50 py-2 px-4 rounded-lg border border-[#88a978]/30"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <p className="text-base font-inter font-medium text-[#2f3b2f]">{report.summary}</p>
                </motion.div>
                {/* Dashboard Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Sustainability Score Card */}
                  <motion.div
                    className="p-4 bg-[#e8f0e8]/80 rounded-lg shadow-sm border border-[#6e8f6e]/40"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <FaLeaf color="#88a978" />
                      <h3 className="text-base font-inter font-medium text-[#1a2c1a]">Sustainability Score</h3>
                    </div>
                    <p className="text-[#2f3b2f] text-xs mb-2 font-roboto-slab">
                      How eco-friendly your product is on a scale of 10.
                    </p>
                    <div className="flex items-center justify-between text-[#1a2c1a] text-sm mb-2">
                      <span>{report.sustainabilityScore.value}/10</span>
                      <span>{report.sustainabilityScore.max}/10</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max={report.sustainabilityScore.max}
                      value={report.sustainabilityScore.value}
                      readOnly
                      disabled
                      className="w-full h-2 bg-[#d9e2d9]/50 rounded-lg appearance-none"
                      style={{
                        background: `linear-gradient(to right, #88a978 ${(report.sustainabilityScore.value / report.sustainabilityScore.max) * 100}%, #d9e2d9 ${(report.sustainabilityScore.value / report.sustainabilityScore.max) * 100}%)`,
                      }}
                    />
                    <p className="text-[#2f3b2f] text-xs mt-2 font-playfair-display italic">
                      {report.aiDescriptions?.sustainabilityScore || 'A glowing badge of your product’s green heart!'}
                    </p>
                  </motion.div>
                  {/* Impact Metrics Cards */}
                  {report.impactMetrics && report.impactMetrics.length > 0 ? (
                    report.impactMetrics.map((metric, index) => (
                      <motion.div
                        key={index}
                        className="p-4 bg-[#e8f0e8]/80 rounded-lg shadow-sm border border-[#6e8f6e]/40"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          {metric.name === 'Carbon Footprint' && <FaRecycle color="#f4a261" />}
                          {metric.name === 'Water Usage' && <FaWater color="#4a90e2" />}
                          {metric.name === 'Energy Consumption' && <FaBolt color="#f7c948" />}
                          <h3 className="text-base font-inter font-medium text-[#1a2c1a]">{metric.name}</h3>
                        </div>
                        <p className="text-[#2f3b2f] text-xs mb-2 font-roboto-slab">
                          {metric.name === 'Carbon Footprint' && 'CO₂ emissions from producing your product.'}
                          {metric.name === 'Water Usage' && 'Water used in your product’s creation.'}
                          {metric.name === 'Energy Consumption' && 'Energy consumed during production.'}
                        </p>
                        <div className="flex items-center justify-between text-[#1a2c1a] text-sm mb-2">
                          <span>{metric.value} {metric.unit}</span>
                          <span>{metric.max} {metric.unit}</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max={metric.max}
                          value={metric.value}
                          readOnly
                          disabled
                          className="w-full h-2 bg-[#d9e2d9]/50 rounded-lg appearance-none"
                          style={{
                            background: `linear-gradient(to right, #88a978 ${(metric.value / metric.max) * 100}%, #d9e2d9 ${(metric.value / metric.max) * 100}%)`,
                          }}
                        />
                        <p className="text-[#2f3b2f] text-xs mt-2 font-playfair-display italic">
                          {report.aiDescriptions?.impactMetrics?.find(desc => desc.name === metric.name)?.description || 'No description available.'}
                        </p>
                      </motion.div>
                    ))
                  ) : (
                    <motion.div
                      className="p-4 bg-[#e8f0e8]/80 rounded-lg shadow-sm border border-[#6e8f6e]/40"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.5 }}
                    >
                      <p className="text-[#2f3b2f] text-sm">Impact metrics unavailable.</p>
                    </motion.div>
                  )}
                  {/* Materials Impact Card */}
                  <motion.div
                    className="p-4 bg-[#e8f0e8]/80 rounded-lg shadow-sm border border-[#6e8f6e]/40"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.7 }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <FaChartPie color="#d4b83e" />
                      <h3 className="text-base font-inter font-medium text-[#1a2c1a]">Materials Impact</h3>
                    </div>
                    <p className="text-[#2f3b2f] text-xs mb-2 font-roboto-slab">
                      What your product is made of and its eco-impact.
                    </p>
                    <div className="h-24 overflow-y-auto scrollbar-thin scrollbar-thumb-[#88a978] scrollbar-track-[#d9e2d9] pr-2">
                      {report.materialsImpact && report.materialsImpact.length > 0 ? (
                        report.materialsImpact.map((item, i) => (
                          <div
                            key={i}
                            className="flex items-start gap-2 text-xs mb-2 border-b border-[#6e8f6e]/20 pb-2"
                          >
                            <div
                              className="w-3 h-3 rounded-full mt-1 flex-shrink-0"
                              style={{
                                backgroundColor: item.impact === 'Low' ? '#88a978' : item.impact === 'High' ? '#f4a261' : '#d4b83e',
                              }}
                            />
                            <div>
                              <div className="flex items-center justify-between">
                                <span className="text-[#1a2c1a] font-medium">{item.name}: {item.percentage}%</span>
                                <span
                                  className={`px-1 py-0.5 rounded text-xs ${
                                    item.impact === 'Low'
                                      ? 'bg-[#88a978]/20 text-[#88a978]'
                                      : item.impact === 'High'
                                      ? 'bg-[#f4a261]/20 text-[#f4a261]'
                                      : 'bg-[#d4b83e]/20 text-[#d4b83e]'
                                  }`}
                                >
                                  {item.impact}
                                </span>
                              </div>
                              <p className="text-[#2f3b2f] text-xs">{item.description}</p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-[#2f3b2f] text-xs">No material data available.</p>
                      )}
                    </div>
                    <p className="text-[#2f3b2f] text-xs mt-2 font-playfair-display italic">
                      {report.aiDescriptions?.materialsImpact || 'The building blocks of your product’s eco-story.'}
                    </p>
                  </motion.div>
                  {/* Lifecycle Impact Card */}
                  <motion.div
                    className="p-4 bg-[#e8f0e8]/80 rounded-lg shadow-sm border border-[#6e8f6e]/40"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.8 }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <FaCogs color="#6e8f6e" />
                      <h3 className="text-base font-inter font-medium text-[#1a2c1a]">Lifecycle Impact</h3>
                    </div>
                    <p className="text-[#2f3b2f] text-xs mb-2 font-roboto-slab">
                      Environmental impact across your product’s lifecycle stages.
                    </p>
                    <div className="flex items-end h-24 mb-2">
                      {report.lifecycleImpact && report.lifecycleImpact.length > 0 ? (
                        report.lifecycleImpact.map((stage, i) => (
                          <div key={i} className="flex-1 flex flex-col items-center">
                            <div
                              className="w-3/4"
                              style={{
                                height: `${stage.percentage}%`,
                                backgroundColor: stage.impact === 'Low' ? '#88a978' : stage.impact === 'High' ? '#f4a261' : '#d4b83e',
                              }}
                            />
                            <p className="text-[#1a2c1a] text-xs mt-1">{stage.stage}</p>
                            <p className="text-[#2f3b2f] text-xs">{stage.description}</p>
                          </div>
                        ))
                      ) : (
                        <p className="text-[#2f3b2f] text-xs">No lifecycle data available.</p>
                      )}
                    </div>
                    <p className="text-[#2f3b2f] text-xs mt-2 font-playfair-display italic">
                      {report.aiDescriptions?.lifecycleImpact || 'A journey through your product’s eco-life stages.'}
                    </p>
                  </motion.div>
                  {/* Eco Tip Card */}
                  <motion.div
                    className="p-4 bg-[#e8f0e8]/80 rounded-lg shadow-sm border border-[#6e8f6e]/40"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.9 }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <FaLeaf color="#88a978" />
                      <h3 className="text-base font-inter font-medium text-[#1a2c1a]">Eco Tip</h3>
                    </div>
                    <p className="text-[#2f3b2f] text-xs mb-2 font-roboto-slab">
                      A simple tip to make your product use greener.
                    </p>
                    <motion.button
                      onClick={() => setSavedTip(!savedTip)}
                      className={`w-full flex items-center gap-2 text-[#2f3b2f] text-sm px-2 py-1 rounded-lg ${
                        savedTip ? 'bg-[#f0f5f0]/50' : 'hover:bg-[#f0f5f0]/30'
                      }`}
                    >
                      {savedTip && <FaCheck color="#88a978" />}
                      <span>{report.ecoTip || 'Use sustainably to reduce impact.'}</span>
                    </motion.button>
                    <p className="text-[#2f3b2f] text-xs mt-2 font-playfair-display italic">
                      {report.aiDescriptions?.ecoTip || 'A whisper of wisdom for a greener tomorrow.'}
                    </p>
                  </motion.div>
                  {/* AI Insight Card */}
                  <motion.div
                    className="p-4 bg-[#f0f5f0]/80 rounded-lg shadow-sm border border-[#88a978]"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 1.0 }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <FaLightbulb color="#f7c948" />
                      <h3 className="text-base font-inter font-medium text-[#1a2c1a]">AI Insight</h3>
                    </div>
                    <p className="text-[#2f3b2f] text-xs mb-2 font-roboto-slab">
                      Smart advice to reduce your product’s impact.
                    </p>
                    <p className="text-[#2f3b2f] text-sm">{report.aiInsight || 'Reduce usage to lower environmental impact.'}</p>
                    <p className="text-[#2f3b2f] text-xs mt-2 font-playfair-display italic">
                      {report.aiDescriptions?.aiInsight || 'A spark of genius to lighten your eco-load.'}
                    </p>
                  </motion.div>
                </div>
                {/* Try Another Product Button */}
                <motion.button
                  onClick={() => {
                    setReport(null);
                    setIsFormVisible(true);
                    setSavedTip(false);
                  }}
                  className="w-full mt-6 px-6 py-3 bg-gradient-to-r from-[#506850] to-[#88a978] text-[#f0f5f0] font-inter font-medium text-base rounded-sm border border-[#6e8f6e] hover:from-[#88a978] hover:to-[#a8c7a8] hover:border-[#88a978] hover:shadow-lg hover:shadow-[#88a978]/50 transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Try Another Product
                </motion.button>
              </div>
            </motion.div>
          )
        ) : null}
      </div>
      {/* Custom Slider and Scrollbar Styles */}
      <style>{`
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 14px;
          height: 14px;
          background: #88a978;
          border-radius: 50%;
          box-shadow: 0 0 3px rgba(0, 0, 0, 0.2);
        }
        input[type="range"]::-moz-range-thumb {
          width: 14px;
          height: 14px;
          background: #88a978;
          border-radius: 50%;
          box-shadow: 0 0 3px rgba(0, 0, 0, 0.2);
        }
        input[type="range"]:disabled {
          opacity: 1;
          cursor: not-allowed;
        }
        .scrollbar-thin {
          scrollbar-width: thin;
        }
        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: #d9e2d9;
          border-radius: 3px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: #88a978;
          border-radius: 3px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: #6e8f6e;
        }
      `}</style>
      {/* Load Custom Fonts */}
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Roboto+Slab:wght@400&family=Playfair+Display:ital@1&display=swap" />
    </section>
  );
};

export default StoryHero;