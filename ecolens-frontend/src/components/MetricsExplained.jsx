import React from 'react';
import { motion } from 'framer-motion';
import { FaLeaf, FaWater, FaBolt, FaRecycle, FaCertificate, FaCogs, FaLightbulb, FaBrain } from 'react-icons/fa';
import './MetricsExplained.css';

const MetricsExplained = () => {
  const metrics = [
    {
      icon: <FaLeaf />,
      title: 'Sustainability Score',
      description: 'Your product’s eco-grade out of 10, blending materials and lifecycle. Higher is greener!',
      learnMore: '#',
    },
    {
      icon: <FaWater />,
      title: 'Carbon Footprint',
      description: 'CO₂ emissions in kg CO₂e. Lower numbers mean cleaner air for all!',
      learnMore: '#',
    },
    {
      icon: <FaBolt />,
      title: 'Water Usage',
      description: 'Liters of water used in production. Choose items that sip, not gulp!',
      learnMore: '#',
    },
    {
      icon: <FaRecycle />,
      title: 'Lifecycle Impact',
      description: 'Tracks your product’s eco-journey from sourcing to disposal, highlighting key impact stages.',
      learnMore: '#',
    },
    {
      icon: <FaCertificate />,
      title: 'Certifications',
      description: 'Eco-badges like GOTS ensure your product’s green cred. Shop confidently!',
      learnMore: '#',
    },
    {
      icon: <FaCogs />,
      title: 'Materials Impact',
      description: 'Evaluates your product’s materials, favoring eco-friendly choices like recycled cotton.',
      learnMore: '#',
    },
    {
      icon: <FaLightbulb />,
      title: 'Energy Consumption',
      description: 'Energy used in kWh during production. Lower energy, brighter future!',
      learnMore: '#',
    },
    {
      icon: <FaBrain />,
      title: 'AI Insight',
      description: 'Smart eco-tips, like choosing biodegradable packaging, for greener decisions.',
      learnMore: '#',
    },
  ];

  return (
    <section className="metrics-explained" aria-labelledby="metrics-title">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="metrics-header"
      >
        <h2 id="metrics-title" className="metrics-title">
          What Do These Metrics Mean?
        </h2>
        <p className="metrics-subtitle">
          Discover the eco-story behind your product’s numbers.
        </p>
      </motion.div>
      <div className="metrics-grid">
        {metrics.map((metric, index) => (
          <motion.div
            key={index}
            className={`metric-card ${index < 4 ? 'top-row' : 'bottom-row'}`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1, ease: 'easeOut' }}
            whileHover={{ scale: 1.03 }}
            role="article"
          >
            <div className="metric-icon" aria-hidden="true">
              {metric.icon}
            </div>
            <h3 className="metric-title">{metric.title}</h3>
            <p className="metric-description">{metric.description}</p>
            <a
              href={metric.learnMore}
              className="metric-learn-more"
              aria-label={`Learn more about ${metric.title}`}
            >
              Learn More
            </a>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default MetricsExplained;