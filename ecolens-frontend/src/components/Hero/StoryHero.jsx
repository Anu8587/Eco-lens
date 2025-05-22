import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../Navbar/Navbar';
import heroImage from '../../assets/hero.png';
import { useState } from 'react';
import { FaLeaf, FaCheck, FaRecycle, FaWater, FaBolt, FaChartPie, FaLightbulb, FaCogs, FaCertificate } from 'react-icons/fa';
import axios from 'axios';

const ReportCard = ({ title, icon, children, delay }) => (
  <motion.div
    className="p-4 bg-[#f0f5f0]/90 rounded-lg shadow-md border border-[#88a978]/30 hover:shadow-lg transition-shadow duration-300"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
  >
    <div className="flex items-center gap-2 mb-3">
      {icon}
      <h3 className="text-lg font-inter font-semibold text-[#1a2c1a]">{title}</h3>
    </div>
    {children}
  </motion.div>
);

const StoryHero = () => {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [formMode, setFormMode] = useState('url');
  const [report, setReport] = useState(null);
  const [error, setError] = useState(null);
  const [savedTip, setSavedTip] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const input = formMode === 'url' ? formData.get('productLink') : formData.get('productDescription');

    if (!input || input.trim() === '') {
      setError(formMode === 'url' ? 'Please enter a valid URL' : 'Please enter a product description');
      return;
    }
    if (formMode === 'url' && !/^https?:\/\//i.test(input)) {
      setError('Please enter a valid URL starting with http:// or https://');
      return;
    }

    setError(null);
    setIsLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/analyze', {
        productLink: formMode === 'url' ? input : '',
        productDescription: formMode === 'description' ? input : '',
      });
      setReport(response.data);
      setIsFormVisible(false);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to analyze the product. Please try again.');
      setReport(null);
    } finally {
      setIsLoading(false);
    }
  };

  const getEnvironmentImpact = (score) => {
    if (score >= 7) return { label: 'Eco-Friendly', color: '#88a978' };
    if (score <= 3) return { label: 'High Impact', color: '#f4a261' };
    return { label: 'Moderate Impact', color: '#d4b83e' };
  };

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
        className="mt-4 px-6 py-2 bg-[#506850] text-[#f0f5f0] font-inter font-medium rounded-sm hover:bg-[#88a978] transition-all duration-300"
      >
        Try Again
      </button>
    </div>
  );

  const renderCircularProgress = (value, max, color = '#88a978') => (
    <div className="relative w-20 h-20 mx-auto">
      <svg className="w-full h-full" viewBox="0 0 36 36">
        <path
          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          fill="none"
          stroke="#e0e0e0"
          strokeWidth="3"
        />
        <path
          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeDasharray={`${(value / max) * 100}, 100`}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-sm font-inter text-[#1a2c1a]">{Math.round((value / max) * 100)}%</span>
      </div>
    </div>
  );

  return (
    <section id="home" className="relative bg-gradient-to-b from-[#e8f0e8] to-[#506850]/30 flex flex-col min-h-screen overflow-hidden">
      <Navbar />
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(100)].map((_, i) => (
          <svg
            key={i}
            className="absolute text-[#506850]/60"
            style={{
              width: `29px`,
              height: `29px`,
              top: `${Math.random() * 60}%`,
              left: `${Math.random() * 100}%`,
              animation: `fall 20s ease-in-out infinite`,
              animationDelay: `${Math.random() * 12}s`,
              transform: `rotate(${Math.random() * 360}deg)`,
              opacity: `0.8`,
            }}
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 3C12 3 9 6 9 9C9 12 12 15 12 15C12 15 15 12 15 9C15 6 12 3 12 3Z" />
          </svg>
        ))}
      </div>
      <div className="flex-1 flex flex-col px-6 md:px-16 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="relative z-10 w-full md:w-1/2 flex flex-col justify-center gap-6">
            <motion.h1
              className="text-3xl md:text-5xl font-inter font-bold leading-tight tracking-tight flex flex-wrap gap-2"
            >
              {headlineWords.map((word, index) => (
                <motion.span
                  key={index}
                  style={{ color: word.color }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, ease: 'easeOut', delay: index * 0.1 }}
                >
                  {word.text}
                </motion.span>
              ))}
            </motion.h1>
            <motion.p
              className="text-lg md:text-xl font-inter text-[#2f3b2f] max-w-md"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut', delay: 0.8 }}
            >
              Discover Sustainable Insights with Ease.
            </motion.p>
            <motion.button
              onClick={handleGetStartedClick}
              className="mt-4 w-36 px-6 py-3 bg-[#506850] text-[#f0f5f0] font-inter font-medium text-base rounded-md hover:bg-[#88a978] transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut', delay: 1.0 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get Started
            </motion.button>
          </div>
          <div className="hidden md:flex w-1/2 h-full items-center justify-end">
            <motion.img
              src={heroImage}
              alt="EcoLens Hero"
              className="w-3/4 h-auto object-contain"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: 0.4 }}
            />
          </div>
        </div>
        <AnimatePresence>
          {isFormVisible && (
            <motion.div
              className="mt-8 flex justify-center"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            >
              <div className="relative w-full max-w-2xl p-8 bg-[#f0f5f0]/95 backdrop-blur-sm rounded-lg shadow-lg border border-[#88a978]/40 flex flex-col gap-6">
                <motion.button
                  onClick={handleCloseClick}
                  className="absolute top-4 right-4 w-8 h-8 bg-[#506850] text-[#f0f5f0] rounded-full flex items-center justify-center hover:bg-[#88a978] transition-all duration-300"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  ×
                </motion.button>
                <motion.div
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: 'easeOut', delay: 0.1 }}
                >
                  <h2 className="text-2xl font-inter font-bold text-[#1a2c1a] tracking-wide">
                    EcoLens Analysis
                  </h2>
                  <p className="text-base font-inter text-[#2f3b2f] mt-1">
                    Enter a product URL or description to uncover its eco-impact.
                  </p>
                </motion.div>
                <motion.div
                  className="relative flex justify-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: 'easeOut', delay: 0.2 }}
                >
                  <div className="relative w-64 bg-[#e8f0e8]/80 border border-[#3b5f3b]/50 rounded-full flex items-center justify-between p-1">
                    <motion.div
                      className="absolute top-1 bottom-1 w-1/2 bg-[#506850] rounded-full shadow-sm"
                      animate={{ x: formMode === 'url' ? 0 : '100%' }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                    />
                    <button
                      type="button"
                      onClick={() => setFormMode('url')}
                      className={`relative z-10 w-1/2 text-sm font-inter font-medium py-1.5 rounded-full ${
                        formMode === 'url' ? 'text-[#f0f5f0]' : 'text-[#1a2c1a]'
                      }`}
                    >
                      Enter URL
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormMode('description')}
                      className={`relative z-10 w-1/2 text-sm font-inter font-medium py-1.5 rounded-full ${
                        formMode === 'description' ? 'text-[#f0f5f0]' : 'text-[#1a2c1a]'
                      }`}
                    >
                      Describe Product
                    </button>
                  </div>
                </motion.div>
                <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
                  {formMode === 'url' ? (
                    <motion.input
                      type="text"
                      name="productLink"
                      placeholder="e.g., https://www.amazon.com/product"
                      className="px-4 py-3 text-[#1a2c1a] font-inter text-base bg-[#e8f0e8]/60 rounded-md border border-[#3b5f3b]/60 placeholder-[#4a664a] focus:outline-none focus:ring-2 focus:ring-[#88a978]/40"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, ease: 'easeOut', delay: 0.3 }}
                    />
                  ) : (
                    <motion.textarea
                      name="productDescription"
                      placeholder="e.g., Organic cotton t-shirt, made in India"
                      rows="4"
                      className="px-4 py-3 text-[#1a2c1a] font-inter text-base bg-[#e8f0e8]/60 rounded-md border border-[#3b5f3b]/60 placeholder-[#4a664a] focus:outline-none focus:ring-2 focus:ring-[#88a978]/40 resize-none"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, ease: 'easeOut', delay: 0.3 }}
                    />
                  )}
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
                  <motion.button
                    type="submit"
                    disabled={isLoading}
                    className={`px-6 py-3 bg-[#506850] text-[#f0f5f0] font-inter font-medium rounded-md hover:bg-[#88a978] transition-all duration-300 ${
                      isLoading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: 'easeOut', delay: 0.4 }}
                    whileHover={{ scale: isLoading ? 1 : 1.05 }}
                    whileTap={{ scale: isLoading ? 1 : 0.95 }}
                  >
                    {isLoading ? 'Analyzing...' : 'Analyze Now'}
                  </motion.button>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        {isLoading && (
          <motion.div
            className="mt-8 flex justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="flex items-center gap-2 p-4 bg-[#e8f0e8]/80 rounded-lg">
              <div className="w-6 h-6 border-2 border-[#88a978] border-t-transparent rounded-full animate-spin" />
              <p className="text-[#1a2c1a] font-inter">Generating Eco Report...</p>
            </div>
          </motion.div>
        )}
        {report && !isFormVisible && !isLoading ? (
          !report.sustainabilityScore || !report.impactMetrics ? (
            renderErrorState()
          ) : (
            <motion.div
              className="mt-8 flex justify-center"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            >
              <div className="w-full max-w-5xl">
                <motion.div
                  className="mb-4 text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <h2 className="text-2xl font-inter font-bold tracking-tight flex justify-center gap-2">
                    {dashboardTitleWords.map((word, index) => (
                      <motion.span
                        key={index}
                        style={{ color: word.color }}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, ease: 'easeOut', delay: index * 0.1 }}
                      >
                        {word.text}
                      </motion.span>
                    ))}
                  </h2>
                </motion.div>
                <motion.div
                  className="mb-6 text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <div
                    className="inline-block px-4 py-2 rounded-full text-base font-inter font-bold shadow-md"
                    style={{
                      backgroundColor: getEnvironmentImpact(report.sustainabilityScore.value).color,
                      color: '#ffffff',
                    }}
                  >
                    {getEnvironmentImpact(report.sustainabilityScore.value).label}
                  </div>
                </motion.div>
                <motion.div
                  className="mb-6 text-center bg-[#f0f5f0]/60 py-3 px-6 rounded-lg border border-[#88a978]/40"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <p className="text-base font-inter font-medium text-[#2f3b2f]">{report.summary}</p>
                </motion.div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <ReportCard
                    title="Sustainability Score"
                    icon={<FaLeaf className="w-5 h-5 text-[#88a978]" />}
                    delay={0.4}
                  >
                    <p className="text-[#2f3b2f] text-sm mb-3 font-roboto-slab">
                      Eco-friendliness on a scale of 10.
                    </p>
                    {renderCircularProgress(report.sustainabilityScore.value, report.sustainabilityScore.max)}
                    <p className="text-[#2f3b2f] text-sm mt-3 font-playfair-display italic">
                      {report.aiDescriptions?.sustainabilityScore || 'A measure of your product’s green footprint.'}
                    </p>
                  </ReportCard>
                  {report.impactMetrics.map((metric, index) => (
                    <ReportCard
                      key={metric.name}
                      title={metric.name}
                      icon={
                        metric.name === 'Carbon Footprint' ? (
                          <FaRecycle className="w-5 h-5 text-[#f4a261]" />
                        ) : metric.name === 'Water Usage' ? (
                          <FaWater className="w-5 h-5 text-[#4a90e2]" />
                        ) : (
                          <FaBolt className="w-5 h-5 text-[#f7c948]" />
                        )
                      }
                      delay={0.5 + index * 0.1}
                    >
                      <p className="text-[#2f3b2f] text-sm mb-3 font-roboto-slab">
                        {metric.name === 'Carbon Footprint' && 'CO₂ emissions from production.'}
                        {metric.name === 'Water Usage' && 'Water used in production.'}
                        {metric.name === 'Energy Consumption' && 'Energy used during production.'}
                      </p>
                      {renderCircularProgress(
                        metric.value,
                        metric.max,
                        metric.name === 'Carbon Footprint' ? '#f4a261' : metric.name === 'Water Usage' ? '#4a90e2' : '#f7c948'
                      )}
                      <p className="text-[#2f3b2f] text-sm mt-3 font-playfair-display italic">
                        {report.aiDescriptions?.impactMetrics?.find(desc => desc.name === metric.name)?.description || 'No description available.'}
                      </p>
                    </ReportCard>
                  ))}
                  <ReportCard
                    title="Materials Impact"
                    icon={<FaChartPie className="w-5 h-5 text-[#d4b83e]" />}
                    delay={0.7}
                  >
                    <p className="text-[#2f3b2f] text-sm mb-3 font-roboto-slab">
                      Composition and eco-impact of materials.
                    </p>
                    <div className="h-24 overflow-y-auto scrollbar-thin scrollbar-thumb-[#88a978] scrollbar-track-[#d9e2d9] pr-2">
                      {report.materialsImpact.length > 0 ? (
                        report.materialsImpact.map((item, i) => (
                          <div
                            key={i}
                            className="flex items-start gap-2 text-sm mb-2 border-b border-[#88a978]/20 pb-2"
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
                                  className={`px-2 py-1 rounded text-xs ${
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
                              <p className="text-[#2f3b2f] text-sm">{item.description}</p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-[#2f3b2f] text-sm">No material data available.</p>
                      )}
                    </div>
                    <p className="text-[#2f3b2f] text-sm mt-3 font-playfair-display italic">
                      {report.aiDescriptions?.materialsImpact || 'The eco-story of your product’s materials.'}
                    </p>
                  </ReportCard>
                  <ReportCard
                    title="Lifecycle Impact"
                    icon={<FaCogs className="w-5 h-5 text-[#6e8f6e]" />}
                    delay={0.8}
                  >
                    <p className="text-[#2f3b2f] text-sm mb-3 font-roboto-slab">
                      Impact across product lifecycle stages.
                    </p>
                    <div className="flex items-end h-24 gap-2">
                      {report.lifecycleImpact.length > 0 ? (
                        report.lifecycleImpact.map((stage, i) => (
                          <div key={i} className="flex-1 flex flex-col items-center group relative">
                            <div
                              className="w-full transition-all duration-300 group-hover:shadow-md"
                              style={{
                                height: `${stage.percentage}%`,
                                backgroundColor: stage.impact === 'Low' ? '#88a978' : stage.impact === 'High' ? '#f4a261' : '#d4b83e',
                              }}
                            />
                            <p className="text-[#1a2c1a] text-xs mt-1 font-inter">{stage.stage}</p>
                            <div className="absolute -top-10 hidden group-hover:block bg-[#1a2c1a] text-[#f0f5f0] text-xs p-2 rounded-md">
                              {stage.description}
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-[#2f3b2f] text-sm">No lifecycle data available.</p>
                      )}
                    </div>
                    <p className="text-[#2f3b2f] text-sm mt-3 font-playfair-display italic">
                      {report.aiDescriptions?.lifecycleImpact || 'The eco-journey of your product.'}
                    </p>
                  </ReportCard>
                  <ReportCard
                    title="Certifications"
                    icon={<FaCertificate className="w-5 h-5 text-[#6e8f6e]" />}
                    delay={0.85}
                  >
                    <p className="text-[#2f3b2f] text-sm mb-3 font-roboto-slab">
                      Eco-certifications earned by the product.
                    </p>
                    <div className="h-24 overflow-y-auto scrollbar-thin scrollbar-thumb-[#88a978] scrollbar-track-[#d9e2d9] pr-2">
                      {report.certifications && report.certifications.length > 0 ? (
                        report.certifications.map((cert, i) => (
                          <div
                            key={i}
                            className="flex items-start gap-2 text-sm mb-2 border-b border-[#88a978]/20 pb-2"
                          >
                            <div className="w-3 h-3 rounded-full mt-1 flex-shrink-0 bg-[#88a978]" />
                            <div>
                              <span className="text-[#1a2c1a] font-medium">{cert.name}</span>
                              <p className="text-[#2f3b2f] text-sm">{cert.description}</p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-[#2f3b2f] text-sm">No certifications available.</p>
                      )}
                    </div>
                    <p className="text-[#2f3b2f] text-sm mt-3 font-playfair-display italic">
                      {report.aiDescriptions?.certifications || 'Badges of your product’s eco-credentials.'}
                    </p>
                  </ReportCard>
                  <ReportCard
                    title="Eco Tip"
                    icon={<FaLeaf className="w-5 h-5 text-[#88a978]" />}
                    delay={0.9}
                  >
                    <p className="text-[#2f3b2f] text-sm mb-3 font-roboto-slab">
                      Practical tip to reduce environmental impact.
                    </p>
                    <button
                      onClick={() => setSavedTip(!savedTip)}
                      className={`w-full flex items-center gap-2 text-[#2f3b2f] text-sm px-2 py-1 rounded-md ${
                        savedTip ? 'bg-[#88a978]/20' : 'hover:bg-[#88a978]/10'
                      } transition-all duration-300`}
                    >
                      {savedTip && <FaCheck className="w-4 h-4 text-[#88a978]" />}
                      <span>{report.ecoTip || 'Opt for sustainable use to minimize impact.'}</span>
                    </button>
                    <p className="text-[#2f3b2f] text-sm mt-3 font-playfair-display italic">
                      {report.aiDescriptions?.ecoTip || 'A green nudge for a better planet.'}
                    </p>
                  </ReportCard>
                  <ReportCard
                    title="AI Insight"
                    icon={<FaLightbulb className="w-5 h-5 text-[#f7c948]" />}
                    delay={1.0}
                  >
                    <p className="text-[#2f3b2f] text-sm mb-3 font-roboto-slab">
                      Smart advice to enhance sustainability.
                    </p>
                    <p className="text-[#2f3b2f] text-sm">{report.aiInsight || 'Consider alternative materials to reduce impact.'}</p>
                    <p className="text-[#2f3b2f] text-sm mt-3 font-playfair-display italic">
                      {report.aiDescriptions?.aiInsight || 'Intelligent guidance for eco-conscious choices.'}
                    </p>
                  </ReportCard>
                </div>
                <motion.button
                  onClick={() => {
                    setReport(null);
                    setIsFormVisible(true);
                    setSavedTip(false);
                  }}
                  className="w-full mt-6 px-6 py-3 bg-[#506850] text-[#f0f5f0] font-inter font-medium rounded-md hover:bg-[#88a978] transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Analyze Another Product
                </motion.button>
              </div>
            </motion.div>
          )
        ) : null}
      </div>
      <style>{`
        @keyframes fall {
          0% { transform: translateY(-100vh) rotate(0deg); opacity: 0.4; }
          100% { transform: translateY(100vh) rotate(360deg); opacity: 0.1; }
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
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Roboto+Slab:wght@400&family=Playfair+Display:ital@1&display=swap" />
    </section>
  );
};

export default StoryHero;