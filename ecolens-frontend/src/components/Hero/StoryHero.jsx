import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../Navbar/Navbar';
import heroImage from '../../assets/hero.png';
import { useState, useRef, useEffect } from 'react';
import { FaLeaf, FaCloud, FaLightbulb, FaRedo, FaCheck, FaWater, FaBolt } from 'react-icons/fa';
import { GiClothJar } from 'react-icons/gi';

const StoryHero = () => {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [formMode, setFormMode] = useState('url'); // 'url' or 'description'
  const [report, setReport] = useState(null); // Store AI-generated report data
  const [error, setError] = useState(null); // Store validation errors
  const [activeTab, setActiveTab] = useState('sustainabilityScore'); // Track active tab in Eco Report
  const [savedTips, setSavedTips] = useState([]); // Track saved eco tips
  const tabRefs = useRef({}); // Store refs for each tab to calculate underline position
  const [underlineStyle, setUnderlineStyle] = useState({ width: 0, left: 0 }); // Sliding underline style

  const headlineWords = [
    { text: 'Uncover', color: '#1a2c1a' },
    { text: 'the', color: '#2e472e' },
    { text: 'Eco', color: '#3b5f3b' },
    { text: 'Impact', color: '#4a774a' },
    { text: 'of', color: '#1a2c1a' },
    { text: 'Your', color: '#2e472e' },
    { text: 'Products', color: '#3b5f3b' },
  ];

  // Define tabs for the sliding toggle navbar (Eco Report only)
  const tabs = [
    { id: 'sustainabilityScore', label: 'Sustainability Score', icon: <FaLeaf color="#88a978" /> },
    { id: 'carbonFootprint', label: 'Carbon Footprint', icon: <FaCloud color="#4a90e2" /> },
    { id: 'materials', label: 'Materials Breakdown', icon: <GiClothJar color="#d4a017" /> },
    { id: 'waterUsage', label: 'Water Usage', icon: <FaWater color="#4a90e2" /> },
    { id: 'energyConsumption', label: 'Energy Consumption', icon: <FaBolt color="#f4d03f" /> },
    { id: 'ecoTips', label: 'Eco Tips', icon: <FaLightbulb color="#f4d03f" /> },
  ];

  // Update underline position when activeTab changes
  useEffect(() => {
    const activeTabElement = tabRefs.current[activeTab];
    if (activeTabElement) {
      setUnderlineStyle({
        width: activeTabElement.offsetWidth,
        left: activeTabElement.offsetLeft,
      });
    }
  }, [activeTab]);

  const handleGetStartedClick = () => {
    setIsFormVisible(true);
  };

  const handleCloseClick = () => {
    setIsFormVisible(false);
  };

  // Mock AI-generated data with AI Insights
  const mockReportData = {
    sustainabilityScore: {
      score: 7,
      description: 'Moderately eco-friendly',
      breakdown: [
        { factor: 'Materials', value: 3, max: 5, note: 'Sourced sustainably' },
        { factor: 'Manufacturing', value: 2, max: 3, note: 'Energy-intensive process' },
        { factor: 'Packaging', value: 2, max: 2, note: 'Minimal packaging' },
      ],
      aiInsights: 'Your sustainability score is above average. Focus on improving manufacturing processes by adopting renewable energy sources to boost your score further.',
    },
    carbonFootprint: {
      value: 5,
      unit: 'kg CO₂e',
      comparison: 'Equivalent to driving 12 miles in a car',
      comparisonNote: 'Based on average car emissions of 0.4 kg CO₂e per mile',
      reductionTip: 'Choose locally made products to reduce shipping emissions',
      aiInsights: 'Your carbon footprint is moderate. Consider sourcing materials closer to the manufacturing site to cut down on transportation emissions.',
    },
    materials: [
      {
        name: 'Organic Cotton',
        percentage: 80,
        impact: 'Low',
        note: 'Low impact, biodegradable',
        details: { sourcedFrom: 'India', certification: 'GOTS' },
      },
      {
        name: 'Polyester',
        percentage: 20,
        impact: 'High',
        note: 'Synthetic, higher impact',
        details: { sourcedFrom: 'China', certification: 'None' },
      },
    ],
    materialsAiInsights: 'The high polyester content increases your environmental impact. Switching to recycled polyester or increasing the organic cotton percentage could improve sustainability.',
    waterUsage: {
      value: 150,
      unit: 'liters',
      comparison: 'Equivalent to 3 average showers',
      comparisonNote: 'Based on an average shower using 50 liters',
      reductionTip: 'Opt for materials that require less water in production',
      aiInsights: 'Water usage is relatively high due to cotton production. Consider using drought-resistant cotton varieties or alternative fibers like hemp.',
    },
    energyConsumption: {
      value: 10,
      unit: 'kWh',
      comparison: 'Equivalent to running a laptop for 50 hours',
      comparisonNote: 'Based on an average laptop using 0.2 kWh per hour',
      reductionTip: 'Choose products from brands using renewable energy',
      aiInsights: 'Energy consumption is moderate. Partnering with manufacturers that use solar or wind energy can significantly reduce this metric.',
    },
    ecoTips: {
      primary: 'Choose 100% organic materials for a lower impact',
      secondary: [
        'Buy second-hand to reduce demand',
        'Look for recyclable packaging',
        'Support brands with transparent supply chains',
      ],
      aiInsights: 'Your eco tips align well with sustainable practices. Additionally, consider advocating for extended producer responsibility to enhance lifecycle management.',
    },
  };

  const handleSubmit = (e) => {
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

    // Clear error, set report data, and show the Eco Report
    setError(null);
    setReport(mockReportData);
    setIsFormVisible(false);
    setActiveTab('sustainabilityScore');
  };

  // Calculate pie chart slices for materials
  const calculatePieChart = (materials) => {
    let startAngle = 0;
    return materials.map((material) => {
      const percentage = material.percentage;
      const angle = (percentage / 100) * 360;
      const slice = {
        startAngle,
        endAngle: startAngle + angle,
        color: material.impact === 'Low' ? '#88a978' : '#f4a261',
        name: material.name,
        percentage,
      };
      startAngle += angle;
      return slice;
    });
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
        {/* Eco Report Section (Appears After Form Submission) */}
        {report && !isFormVisible && (
          <motion.div
            className="mt-6 flex justify-center"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <div className="w-full max-w-4xl">
              {/* Sliding Toggle Navbar */}
              <div className="relative flex justify-center w-full">
                <div className="flex w-full border-b border-[#6e8f6e]/40 overflow-x-auto">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      ref={(el) => (tabRefs.current[tab.id] = el)}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 px-4 py-2 text-sm font-inter font-medium transition-colors duration-300 ${
                        activeTab === tab.id ? 'text-[#1a2c1a]' : 'text-[#2f3b2f]'
                      }`}
                    >
                      {tab.icon}
                      <span>{tab.label}</span>
                    </button>
                  ))}
                </div>
                {/* Sliding Underline */}
                <motion.div
                  className="absolute bottom-0 h-1 bg-[#88a978]"
                  style={{ width: underlineStyle.width, left: underlineStyle.left }}
                  initial={false}
                  animate={{ width: underlineStyle.width, left: underlineStyle.left }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              </div>
              {/* Report Content */}
              <div className="mt-4 p-10 bg-[#506850]/30 bg-gradient-to-b from-[#e8f0e8]/80 to-[#6e8f6e]/40 backdrop-blur-md border border-[#6e8f6e]/40 rounded-lg shadow-sm">
                {/* Sustainability Score Section */}
                {activeTab === 'sustainabilityScore' && (
                  <div>
                    <h3 className="text-xl font-inter font-medium text-[#1a2c1a] mb-6 flex items-center gap-2">
                      <FaLeaf color="#88a978" />
                      Sustainability Score
                    </h3>
                    <div className="px-4 py-3 bg-[#e8f0e8]/40 rounded-lg">
                      {/* Score Circle */}
                      <div className="flex items-center justify-center mb-4">
                        <div className="relative w-24 h-24">
                          <div className="absolute inset-0 rounded-full border-4 border-[#88a978] border-t-transparent" style={{ transform: `rotate(${(report.sustainabilityScore.score / 10) * 360}deg)` }}></div>
                          <div className="absolute inset-0 rounded-full border-4 border-[#d9e2d9]/50"></div>
                          <div className="flex items-center justify-center h-full text-[#1a2c1a] font-inter font-bold text-xl">
                            {report.sustainabilityScore.score}/10
                          </div>
                        </div>
                      </div>
                      <p className="text-[#2f3b2f] text-center mb-4 text-base">{report.sustainabilityScore.description}</p>
                      {/* Score Breakdown */}
                      <div className="space-y-3">
                        {report.sustainabilityScore.breakdown.map((item, index) => (
                          <div key={index} className="relative">
                            <div className="flex items-center justify-between text-[#1a2c1a] text-base">
                              <span>{item.factor}</span>
                              <span>{item.value}/{item.max}</span>
                            </div>
                            <div className="w-full h-3 bg-[#d9e2d9]/50 rounded-full mt-1">
                              <motion.div
                                className="h-full bg-[#a8c7a8] rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${(item.value / item.max) * 100}%` }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                              />
                            </div>
                            <div className="absolute top-0 left-0 w-full h-full opacity-0 hover:opacity-100 transition-opacity">
                              <div className="absolute top-[-30px] left-1/2 transform -translate-x-1/2 bg-[#1a2c1a] text-[#f0f5f0] text-xs rounded px-2 py-1">{item.note}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                      {/* AI Insights */}
                      <div className="mt-6 p-4 bg-[#f0f5f0]/50 border border-dashed border-[#88a978] rounded-lg">
                        <h4 className="text-base font-inter font-medium text-[#1a2c1a] mb-2">AI Insights</h4>
                        <p className="text-[#2f3b2f] text-sm">{report.sustainabilityScore.aiInsights}</p>
                      </div>
                    </div>
                  </div>
                )}
                {/* Carbon Footprint Section */}
                {activeTab === 'carbonFootprint' && (
                  <div>
                    <h3 className="text-xl font-inter font-medium text-[#1a2c1a] mb-6 flex items-center gap-2">
                      <FaCloud color="#4a90e2" />
                      Carbon Footprint
                    </h3>
                    <div className="px-4 py-3 bg-[#e8f0e8]/40 rounded-lg">
                      <div className="flex items-center justify-between text-[#1a2c1a] text-base mb-2">
                        <span>{report.carbonFootprint.value} {report.carbonFootprint.unit}</span>
                      </div>
                      <div className="w-full h-4 bg-[#d9e2d9]/50 rounded-full">
                        <motion.div
                          className="h-full bg-gradient-to-r from-[#4a90e2] to-[#6ab0f3] rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${(report.carbonFootprint.value / 10) * 100}%` }}
                          transition={{ duration: 0.5 }}
                        />
                      </div>
                      <div className="relative mt-2 text-[#2f3b2f] text-base">
                        <span>{report.carbonFootprint.comparison}</span>
                        <div className="absolute top-[-30px] left-1/2 transform -translate-x-1/2 bg-[#1a2c1a] text-[#f0f5f0] text-xs rounded px-2 py-1 opacity-0 hover:opacity-100 transition-opacity">
                          {report.carbonFootprint.comparisonNote}
                        </div>
                      </div>
                      <p className="mt-2 text-[#2f3b2f] text-base">{report.carbonFootprint.reductionTip}</p>
                      {/* AI Insights */}
                      <div className="mt-6 p-4 bg-[#f0f5f0]/50 border border-dashed border-[#88a978] rounded-lg">
                        <h4 className="text-base font-inter font-medium text-[#1a2c1a] mb-2">AI Insights</h4>
                        <p className="text-[#2f3b2f] text-sm">{report.carbonFootprint.aiInsights}</p>
                      </div>
                    </div>
                  </div>
                )}
                {/* Materials Breakdown Section */}
                {activeTab === 'materials' && (
                  <div>
                    <h3 className="text-xl font-inter font-medium text-[#1a2c1a] mb-6 flex items-center gap-2">
                      <GiClothJar color="#d4a017" />
                      Materials Breakdown
                    </h3>
                    <div className="px-4 py-3 bg-[#e8f0e8]/40 rounded-lg">
                      {/* Pie Chart for Materials */}
                      <div className="flex justify-center mb-4">
                        <svg width="200" height="200" viewBox="0 0 100 100">
                          {calculatePieChart(report.materials).map((slice, index) => {
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
                                key={index}
                                d={pathData}
                                fill={slice.color}
                                stroke="#d9e2d9"
                                strokeWidth="1"
                              />
                            );
                          })}
                        </svg>
                      </div>
                      {/* Materials List */}
                      {report.materials.map((material, index) => (
                        <div key={index} className="mb-4">
                          <div className="relative flex items-center justify-between text-[#1a2c1a] text-base">
                            <span>{material.name}: {material.percentage}%</span>
                            <span className={`text-sm px-2 py-1 rounded ${material.impact === 'Low' ? 'bg-[#88a978]/20 text-[#88a978]' : 'bg-[#f4a261]/20 text-[#f4a261]'}`}>
                              {material.impact} Impact
                            </span>
                            <div className="absolute top-[-30px] left-1/2 transform -translate-x-1/2 bg-[#1a2c1a] text-[#f0f5f0] text-xs rounded px-2 py-1 opacity-0 hover:opacity-100 transition-opacity">
                              {material.note}
                            </div>
                          </div>
                          <div className="w-full h-3 bg-[#d9e2d9]/50 rounded-full mt-1">
                            <motion.div
                              className="h-full bg-[#d4a017] rounded-full"
                              initial={{ width: 0 }}
                              animate={{ width: `${material.percentage}%` }}
                              transition={{ duration: 0.5, delay: index * 0.1 }}
                            />
                          </div>
                          <motion.button
                            onClick={() => setActiveTab(activeTab === `material-${index}` ? 'materials' : `material-${index}`)}
                            className="text-[#2f3b2f] text-sm mt-1"
                          >
                            {activeTab === `material-${index}` ? 'Hide Details' : 'Show Details'}
                          </motion.button>
                          {activeTab === `material-${index}` && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              transition={{ duration: 0.3 }}
                              className="mt-1 text-[#2f3b2f] text-sm"
                            >
                              <p>Sourced from: {material.details.sourcedFrom}</p>
                              <p>Certification: {material.details.certification}</p>
                            </motion.div>
                          )}
                        </div>
                      ))}
                      {/* AI Insights */}
                      <div className="mt-6 p-4 bg-[#f0f5f0]/50 border border-dashed border-[#88a978] rounded-lg">
                        <h4 className="text-base font-inter font-medium text-[#1a2c1a] mb-2">AI Insights</h4>
                        <p className="text-[#2f3b2f] text-sm">{report.materialsAiInsights}</p>
                      </div>
                    </div>
                  </div>
                )}
                {/* Water Usage Section */}
                {activeTab === 'waterUsage' && (
                  <div>
                    <h3 className="text-xl font-inter font-medium text-[#1a2c1a] mb-6 flex items-center gap-2">
                      <FaWater color="#4a90e2" />
                      Water Usage
                    </h3>
                    <div className="px-4 py-3 bg-[#e8f0e8]/40 rounded-lg">
                      <div className="flex items-center justify-between text-[#1a2c1a] text-base mb-2">
                        <span>{report.waterUsage.value} {report.waterUsage.unit}</span>
                      </div>
                      <div className="w-full h-4 bg-[#d9e2d9]/50 rounded-full">
                        <motion.div
                          className="h-full bg-gradient-to-r from-[#4a90e2] to-[#6ab0f3] rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${(report.waterUsage.value / 200) * 100}%` }}
                          transition={{ duration: 0.5 }}
                        />
                      </div>
                      <div className="relative mt-2 text-[#2f3b2f] text-base">
                        <span>{report.waterUsage.comparison}</span>
                        <div className="absolute top-[-30px] left-1/2 transform -translate-x-1/2 bg-[#1a2c1a] text-[#f0f5f0] text-xs rounded px-2 py-1 opacity-0 hover:opacity-100 transition-opacity">
                          {report.waterUsage.comparisonNote}
                        </div>
                      </div>
                      <p className="mt-2 text-[#2f3b2f] text-base">{report.waterUsage.reductionTip}</p>
                      {/* AI Insights */}
                      <div className="mt-6 p-4 bg-[#f0f5f0]/50 border border-dashed border-[#88a978] rounded-lg">
                        <h4 className="text-base font-inter font-medium text-[#1a2c1a] mb-2">AI Insights</h4>
                        <p className="text-[#2f3b2f] text-sm">{report.waterUsage.aiInsights}</p>
                      </div>
                    </div>
                  </div>
                )}
                {/* Energy Consumption Section */}
                {activeTab === 'energyConsumption' && (
                  <div>
                    <h3 className="text-xl font-inter font-medium text-[#1a2c1a] mb-6 flex items-center gap-2">
                      <FaBolt color="#f4d03f" />
                      Energy Consumption
                    </h3>
                    <div className="px-4 py-3 bg-[#e8f0e8]/40 rounded-lg">
                      <div className="flex items-center justify-between text-[#1a2c1a] text-base mb-2">
                        <span>{report.energyConsumption.value} {report.energyConsumption.unit}</span>
                      </div>
                      <div className="w-full h-4 bg-[#d9e2d9]/50 rounded-full">
                        <motion.div
                          className="h-full bg-gradient-to-r from-[#f4d03f] to-[#ffd700] rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${(report.energyConsumption.value / 15) * 100}%` }}
                          transition={{ duration: 0.5 }}
                        />
                      </div>
                      <div className="relative mt-2 text-[#2f3b2f] text-base">
                        <span>{report.energyConsumption.comparison}</span>
                        <div className="absolute top-[-30px] left-1/2 transform -translate-x-1/2 bg-[#1a2c1a] text-[#f0f5f0] text-xs rounded px-2 py-1 opacity-0 hover:opacity-100 transition-opacity">
                          {report.energyConsumption.comparisonNote}
                        </div>
                      </div>
                      <p className="mt-2 text-[#2f3b2f] text-base">{report.energyConsumption.reductionTip}</p>
                      {/* AI Insights */}
                      <div className="mt-6 p-4 bg-[#f0f5f0]/50 border border-dashed border-[#88a978] rounded-lg">
                        <h4 className="text-base font-inter font-medium text-[#1a2c1a] mb-2">AI Insights</h4>
                        <p className="text-[#2f3b2f] text-sm">{report.energyConsumption.aiInsights}</p>
                      </div>
                    </div>
                  </div>
                )}
                {/* Eco Tips Section */}
                {activeTab === 'ecoTips' && (
                  <div>
                    <h3 className="text-xl font-inter font-medium text-[#1a2c1a] mb-6 flex items-center gap-2">
                      <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 0.5, repeat: 1 }}>
                        <FaLightbulb color="#f4d03f" />
                      </motion.div>
                      Eco Tips
                    </h3>
                    <div className="px-4 py-3 bg-[#e8f0e8]/40 rounded-lg">
                      <p className="text-[#1a2c1a] text-base mb-3">{report.ecoTips.primary}</p>
                      <div className="space-y-3">
                        {report.ecoTips.secondary.map((tip, index) => (
                          <motion.button
                            key={index}
                            onClick={() => setSavedTips(savedTips.includes(index) ? savedTips.filter(i => i !== index) : [...savedTips, index])}
                            className={`w-full flex items-center gap-2 text-[#2f3b2f] text-base px-2 py-1 rounded-lg ${
                              savedTips.includes(index) ? 'bg-[#f0f5f0]/50' : 'hover:bg-[#f0f5f0]/30'
                            }`}
                          >
                            {savedTips.includes(index) && <FaCheck color="#88a978" />}
                            <span>{tip}</span>
                          </motion.button>
                        ))}
                      </div>
                      {/* AI Insights */}
                      <div className="mt-6 p-4 bg-[#f0f5f0]/50 border border-dashed border-[#88a978] rounded-lg">
                        <h4 className="text-base font-inter font-medium text-[#1a2c1a] mb-2">AI Insights</h4>
                        <p className="text-[#2f3b2f] text-sm">{report.ecoTips.aiInsights}</p>
                      </div>
                    </div>
                  </div>
                )}
                {/* Try Another Product Button */}
                <motion.button
                  onClick={() => {
                    setReport(null);
                    setIsFormVisible(true);
                    setActiveTab('sustainabilityScore');
                    setSavedTips([]);
                  }}
                  className="w-full mt-8 px-6 py-3 bg-gradient-to-r from-[#506850] to-[#88a978] text-[#f0f5f0] font-inter font-medium text-base rounded-sm border border-[#6e8f6e] hover:from-[#88a978] hover:to-[#a8c7a8] hover:border-[#88a978] hover:shadow-lg hover:shadow-[#88a978]/50 transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center justify-center gap-2">
                    <FaRedo />
                    <span>Try Another Product</span>
                  </div>
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default StoryHero;