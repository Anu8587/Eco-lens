require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // Allow requests from your frontend
}));
app.use(express.json());

// Test Route
app.get('/', (req, res) => {
  res.send('EcoLens Backend is running!');
});

// Analyze Endpoint
app.post('/api/analyze', async (req, res) => {
  const { productLink, productDescription } = req.body;

  // Basic validation
  if (!productLink && !productDescription) {
    return res.status(400).json({ error: 'Please provide a product URL or description' });
  }
  if (productLink && !productLink.startsWith('http')) {
    return res.status(400).json({ error: 'Please provide a valid URL starting with http:// or https://' });
  }

  try {
    // Prepare the prompt for Gemini API
    const input = productLink || productDescription;
    const prompt = productLink
      ? `Analyze the sustainability of the product from this URL: ${productLink}. Provide a detailed eco-impact report including sustainability score (out of 10), carbon footprint (in kg CO₂e), materials breakdown (with percentages and impact), water usage (in liters), energy consumption (in kWh), and eco tips. Include AI insights for each section.`
      : `Analyze the sustainability of this product based on the description: "${productDescription}". Provide a detailed eco-impact report including sustainability score (out of 10), carbon footprint (in kg CO₂e), materials breakdown (with percentages and impact), water usage (in liters), energy consumption (in kWh), and eco tips. Include AI insights for each section.`;

    // Call Gemini API
    const response = await axios.post(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=' + process.env.GEMINI_API_KEY,
      {
        contents: [{ parts: [{ text: prompt }] }],
      },
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );

    // Extract the generated text from the response
    const generatedText = response.data.candidates[0].content.parts[0].text;

    // Parse the generated text into a structured format
    const report = parseGeminiResponse(generatedText);

    res.json(report);
  } catch (error) {
    console.error('Error analyzing product:', error.message);
    res.status(500).json({ error: 'Failed to analyze the product. Please try again.' });
  }
});

// Temporary placeholder for parsing Gemini response
function parseGeminiResponse(text) {
  // For now, return a static structure matching the format expected by StoryHero.jsx
  // We'll update this in a later step after testing the Gemini API response
  return {
    sustainabilityScore: {
      score: 7,
      description: 'Moderately eco-friendly',
      breakdown: [
        { factor: 'Materials', value: 3, max: 5, note: 'Sourced sustainably' },
        { factor: 'Manufacturing', value: 2, max: 3, note: 'Energy-intensive process' },
        { factor: 'Packaging', value: 2, max: 2, note: 'Minimal packaging' },
      ],
      aiInsights: 'Your sustainability score is above average. Focus on improving manufacturing processes.',
    },
    carbonFootprint: {
      value: 5,
      unit: 'kg CO₂e',
      comparison: 'Equivalent to driving 12 miles in a car',
      comparisonNote: 'Based on average car emissions of 0.4 kg CO₂e per mile',
      reductionTip: 'Choose locally made products to reduce shipping emissions',
      aiInsights: 'Consider sourcing materials closer to the manufacturing site.',
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
    materialsAiInsights: 'Switch to recycled polyester to improve sustainability.',
    waterUsage: {
      value: 150,
      unit: 'liters',
      comparison: 'Equivalent to 3 average showers',
      comparisonNote: 'Based on an average shower using 50 liters',
      reductionTip: 'Opt for materials that require less water in production',
      aiInsights: 'Consider using drought-resistant cotton varieties.',
    },
    energyConsumption: {
      value: 10,
      unit: 'kWh',
      comparison: 'Equivalent to running a laptop for 50 hours',
      comparisonNote: 'Based on an average laptop using 0.2 kWh per hour',
      reductionTip: 'Choose products from brands using renewable energy',
      aiInsights: 'Partner with manufacturers that use solar or wind energy.',
    },
    ecoTips: {
      primary: 'Choose 100% organic materials for a lower impact',
      secondary: [
        'Buy second-hand to reduce demand',
        'Look for recyclable packaging',
        'Support brands with transparent supply chains',
      ],
      aiInsights: 'Advocate for extended producer responsibility.',
    },
  };
}

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});