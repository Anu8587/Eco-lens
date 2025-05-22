import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../Navbar/Navbar';
import heroImage from '../../assets/hero.png';
import { useState } from 'react';
import { FaLeaf, FaCheck, FaRecycle, FaWater, FaBolt, FaChartPie, FaLightbulb } from 'react-icons/fa';
import axios from 'axios';

const StoryHero = () => {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [formMode, setFormMode] = useState('url'); // 'url' or 'description'
  const [report, setReport] = useState(null); // Store AI-generated report data
  const [error, setError] = useState(null); // Store validation errors
  const [savedTip, setSavedTip] = useState(false); // Track if eco tip is saved
  const [sliderValues, setSliderValues] = useState({}); // Track slider values for interactivity

  const headlineWords = [
    { text: 'Uncover', color: '#1a2c1a' },
    { text: 'the', color: '#2e472e' },
    { text: 'Eco', color: '#3b5f3b' },
    { text: 'Impact', color: '#4a774a' },
    { text: 'of', color: '#1a2c1a' },
    { text: 'Your', color: '#2e472e' },
    { text: 'Products', color: '#3b5f3b' },
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
      setReport(response.data);
      setIsFormVisible(false);
      // Initialize slider values based on the report metrics
      const initialSliderValues = {};
      response.data.impactMetrics.forEach((metric, index) => {
        initialSliderValues[index] = metric.value;
      });
      setSliderValues(initialSliderValues);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to analyze the product. Please try again.');
    }
  };

  // Helper to calculate pie chart slices for materials
  const calculatePieChart = (materials) => {
    let startAngle = 0;
    return materials.map((item) => {
      const percentage = item.percentage;
      const angle = (percentage / 100) * 360;
      const slice = {
        startAngle,
        endAngle: startAngle + angle,
        color: item.impact === 'Low' ? '#88a978' : '#f4a261',
        name: item.name,
        percentage,
      };
      startAngle += angle;
      return slice;
    });
  };

  // Helper to calculate tree savings for carbon footprint reduction
  const calculateTreeSavings = (originalValue, currentValue) => {
    const reduction = originalValue - currentValue;
    if (reduction <= 0) return 0;
    // 1 tree absorbs ~25 kg CO₂e per year (simplified estimate)
    return (reduction / 25).toFixed(1);
  };

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
        {report && !isFormVisible && (
          <motion.div
            className="mt-6 flex justify-center"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <div className="w-full max-w-4xl">
              {/* Summary */}
              <motion.div
                className="mb-6 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <h2 className="text-2xl font-inter font-bold text-[#1a2c1a]">{report.summary}</h2>
              </motion.div>
              {/* Dashboard Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Sustainability Score Card */}
                <motion.div
                  className="p-4 bg-[#e8f0e8]/80 rounded-lg shadow-sm border border-[#6e8f6e]/40"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <FaLeaf color="#88a978" />
                    <h3 className="text-base font-inter font-medium text-[#1a2c1a]">Sustainability Score</h3>
                  </div>
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
                    className="w-full h-2 bg-[#d9e2d9]/50 rounded-lg appearance-none"
                    style={{
                      background: `linear-gradient(to right, #88a978 ${(report.sustainabilityScore.value / report.sustainabilityScore.max) * 100}%, #d9e2d9 ${(report.sustainabilityScore.value / report.sustainabilityScore.max) * 100}%)`,
                    }}
                  />
                </motion.div>
                {/* Impact Metrics Cards */}
                {report.impactMetrics.map((metric, index) => (
                  <motion.div
                    key={index}
                    className="p-4 bg-[#e8f0e8]/80 rounded-lg shadow-sm border border-[#6e8f6e]/40"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      {metric.name === 'Carbon Footprint' && <FaRecycle color="#88a978" />}
                      {metric.name === 'Water Usage' && <FaWater color="#88a978" />}
                      {metric.name === 'Energy Consumption' && <FaBolt color="#88a978" />}
                      <h3 className="text-base font-inter font-medium text-[#1a2c1a]">{metric.name}</h3>
                    </div>
                    <div className="flex items-center justify-between text-[#1a2c1a] text-sm mb-2">
                      <span>{sliderValues[index]} {metric.unit}</span>
                      <span>{metric.max} {metric.unit}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max={metric.max}
                      value={sliderValues[index] || metric.value}
                      onChange={(e) => {
                        const newValue = parseFloat(e.target.value);
                        setSliderValues({ ...sliderValues, [index]: newValue });
                      }}
                      className="w-full h-2 bg-[#d9e2d9]/50 rounded-lg appearance-none cursor-pointer"
                      style={{
                        background: `linear-gradient(to right, #88a978 ${(sliderValues[index] / metric.max) * 100}%, #d9e2d9 ${(sliderValues[index] / metric.max) * 100}%)`,
                      }}
                    />
                    {metric.name === 'Carbon Footprint' && (
                      <p className="text-[#2f3b2f] text-xs mt-2">
                        Reducing saves {calculateTreeSavings(metric.value, sliderValues[index])} trees per year.
                      </p>
                    )}
                  </motion.div>
                ))}
                {/* Materials Impact Card */}
                <motion.div
                  className="p-4 bg-[#e8f0e8]/80 rounded-lg shadow-sm border border-[#6e8f6e]/40"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <FaChartPie color="#88a978" />
                    <h3 className="text-base font-inter font-medium text-[#1a2c1a]">Materials Impact</h3>
                  </div>
                  <div className="flex justify-center mb-2">
                    <svg width="80" height="80" viewBox="0 0 100 100">
                      {calculatePieChart(report.materialsImpact).map((slice, i) => {
                        const startRad = (slice.startAngle * Math.PI) / 180;
                        const endRad = (slice.endAngle * Math.PI) / 180;
                        const x1 = 50 + 50 * Math.cos(startRad);
                        const y1 = 50 + 50 * Math.sin(startRad);
                        const x2 = 50 + 50 * Math.cos(endRad);
                        const y2 = 50 + 50 * Math.sin(endRad);
                        const largeArcFlag = slice.endAngle - slice.startAngle > 180 ? 1 : 0;
                        const pathData = [
                          `M 50 50`,
                          `L ${x1} ${y1}`,
                          `A 50 50 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                          `Z`,
                        ].join(' ');
                        return (
                          <path
                            key={i}
                            d={pathData}
                            fill={slice.color}
                            stroke="#d9e2d9"
                            strokeWidth="1"
                          />
                        );
                      })}
                    </svg>
                  </div>
                  <div className="space-y-1">
                    {report.materialsImpact.map((item, i) => (
                      <div key={i} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: item.impact === 'Low' ? '#88a978' : '#f4a261' }}
                          />
                          <span className="text-[#1a2c1a]">{item.name}: {item.percentage}%</span>
                        </div>
                        <span className={`px-1 py-0.5 rounded ${item.impact === 'Low' ? 'bg-[#88a978]/20 text-[#88a978]' : 'bg-[#f4a261]/20 text-[#f4a261]'}`}>
                          {item.impact}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>
                {/* Eco Tip Card */}
                <motion.div
                  className="p-4 bg-[#e8f0e8]/80 rounded-lg shadow-sm border border-[#6e8f6e]/40"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <FaLeaf color="#88a978" />
                    <h3 className="text-base font-inter font-medium text-[#1a2c1a]">Eco Tip</h3>
                  </div>
                  <motion.button
                    onClick={() => setSavedTip(!savedTip)}
                    className={`w-full flex items-center gap-2 text-[#2f3b2f] text-sm px-2 py-1 rounded-lg ${
                      savedTip ? 'bg-[#f0f5f0]/50' : 'hover:bg-[#f0f5f0]/30'
                    }`}
                  >
                    {savedTip && <FaCheck color="#88a978" />}
                    <span>{report.ecoTip}</span>
                  </motion.button>
                </motion.div>
                {/* AI Insight Card */}
                <motion.div
                  className="p-4 bg-[#f0f5f0]/80 rounded-lg shadow-sm border border-[#88a978]"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.7 }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <FaLightbulb color="#88a978" />
                    <h3 className="text-base font-inter font-medium text-[#1a2c1a]">AI Insight</h3>
                  </div>
                  <p className="text-[#2f3b2f] text-sm">{report.aiInsight}</p>
                </motion.div>
              </div>
              {/* Try Another Product Button */}
              <motion.button
                onClick={() => {
                  setReport(null);
                  setIsFormVisible(true);
                  setSavedTip(false);
                  setSliderValues({});
                }}
                className="w-full mt-6 px-6 py-3 bg-gradient-to-r from-[#506850] to-[#88a978] text-[#f0f5f0] font-inter font-medium text-base rounded-sm border border-[#6e8f6e] hover:from-[#88a978] hover:to-[#a8c7a8] hover:border-[#88a978] hover:shadow-lg hover:shadow-[#88a978]/50 transition-all duration-300"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Try Another Product
              </motion.button>
            </div>
          </motion.div>
        )}
      </div>
      {/* Custom Slider Styles */}
      <style>{`
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 14px;
          height: 14px;
          background: #88a978;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 0 3px rgba(0, 0, 0, 0.2);
        }
        input[type="range"]::-moz-range-thumb {
          width: 14px;
          height: 14px;
          background: #88a978;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 0 3px rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </section>
  );
};

export default StoryHero;