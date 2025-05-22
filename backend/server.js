const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory cache
const cache = new Map();
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds

// Helper to scrape product details from a URL
const scrapeProductDetails = async (url) => {
  try {
    const { data } = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
    });
    const $ = cheerio.load(data);

    const title = $('h1').text().trim() || 'Unknown Product';
    const description = $('#productDescription, .product-description, [data-testid="pdp-description"]').text().trim() || '';
    const materials = $('[data-testid="materials"], .materials, .composition').text().trim() || '';

    return `${title}. ${description}. Materials: ${materials}.`.trim();
  } catch (error) {
    console.error('Error scraping URL:', error.message);
    return null;
  }
};

// Helper to call Gemini API
const callGeminiAPI = async (prompt) => {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${process.env.GEMINI_API_KEY}`;
  try {
    const response = await axios.post(url, {
      contents: [{ parts: [{ text: prompt }] }],
    }, {
      headers: { 'Content-Type': 'application/json' },
    });
    return response.data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error('Error calling Gemini API:', error.message);
    throw new Error('Failed to analyze product with Gemini API');
  }
};

// Helper to parse Gemini API response
function parseGeminiResponse(text, productInput) {
  // Base structure for the report
  let report = {
    summary: '',
    sustainabilityScore: { value: null, max: 10 },
    impactMetrics: [],
    materialsImpact: [],
    lifecycleImpact: [],
    ecoTip: '',
    aiInsight: '',
    aiDescriptions: {
      sustainabilityScore: '',
      impactMetrics: [],
      materialsImpact: '',
      lifecycleImpact: '',
      ecoTip: '',
      aiInsight: '',
    },
  };

  try {
    // Split the response into lines
    const lines = text.split('\n').map(line => line.trim()).filter(line => line);

    // Helper to extract a number followed by a unit
    const extractMetric = (text, units, defaultMax) => {
      for (const unit of units) {
        const match = text.match(new RegExp(`~?(\\d+\\.?\\d*)\\s*${unit}`, 'i'));
        if (match) return { value: parseFloat(match[1]), unit, max: defaultMax };
      }
      return null;
    };

    // Helper to extract percentage-based lists (e.g., materials)
    const extractPercentageList = text => {
      const items = text.matchAll(/(.*?)\s*\((\d+)%\)\s*-\s*(Low|High|Medium)\s*-\s*(.*?)(?=\n|$)/gi);
      return Array.from(items, match => ({
        name: match[1].trim(),
        percentage: parseInt(match[2]),
        impact: match[3],
        description: match[4].trim(),
      }));
    };

    // Helper to extract lifecycle stages (e.g., Manufacturing: 40% - High)
    const extractLifecycleStages = text => {
      const items = text.matchAll(/(.*?):\s*(\d+)%\s*-\s*(Low|High|Medium)\s*-\s*(.*?)(?=\n|$)/gi);
      return Array.from(items, match => ({
        stage: match[1].trim(),
        percentage: parseInt(match[2]),
        impact: match[3],
        description: match[4].trim(),
      }));
    };

    // Helper to extract score (e.g., 7/10)
    const extractScore = text => {
      const match = text.match(/(\d+)\/(\d+)/);
      if (match) return { value: parseInt(match[1]), max: parseInt(match[2]) };
      return null;
    };

    // Parse each line based on expected labels with deduplication
    const seenMetrics = new Set();
    lines.forEach(line => {
      const lowerLine = line.toLowerCase();

      // Summary
      if (lowerLine.includes('summary')) {
        const summaryMatch = line.match(/Summary:\s*(.*)/i);
        if (summaryMatch) report.summary = summaryMatch[1].trim();
      }

      // Sustainability Score
      if (lowerLine.includes('sustainability score')) {
        const score = extractScore(line);
        if (score) report.sustainabilityScore = score;
      }

      // Impact Metrics (Carbon Footprint, Water Usage, Energy Consumption) with deduplication
      if (lowerLine.includes('carbon footprint') || lowerLine.includes('co₂') || lowerLine.includes('emissions')) {
        if (!seenMetrics.has('Carbon Footprint')) {
          const metric = extractMetric(line, ['kg CO₂e', 'kg CO2e', 'kg CO₂'], 50);
          if (metric) {
            report.impactMetrics.push({ name: 'Carbon Footprint', ...metric });
            seenMetrics.add('Carbon Footprint');
          }
        }
      }
      if (lowerLine.includes('water') && (lowerLine.includes('usage') || lowerLine.includes('consumption'))) {
        if (!seenMetrics.has('Water Usage')) {
          const metric = extractMetric(line, ['liters', 'litres'], 2000);
          if (metric) {
            report.impactMetrics.push({ name: 'Water Usage', ...metric });
            seenMetrics.add('Water Usage');
          }
        }
      }
      if (lowerLine.includes('energy') && (lowerLine.includes('consumption') || lowerLine.includes('usage'))) {
        if (!seenMetrics.has('Energy Consumption')) {
          const metric = extractMetric(line, ['kWh', 'kwh'], 100);
          if (metric) {
            report.impactMetrics.push({ name: 'Energy Consumption', ...metric });
            seenMetrics.add('Energy Consumption');
          }
        }
      }

      // Materials Impact
      if (lowerLine.includes('materials impact')) {
        const materials = extractPercentageList(line);
        if (materials.length > 0) report.materialsImpact = materials;
      }

      // Lifecycle Impact
      if (lowerLine.includes('lifecycle impact')) {
        const lifecycle = extractLifecycleStages(line);
        if (lifecycle.length > 0) report.lifecycleImpact = lifecycle;
      }

      // Eco Tip
      if (lowerLine.includes('eco tip')) {
        const tipMatch = line.match(/Eco Tip:\s*(.*)/i);
        if (tipMatch) report.ecoTip = tipMatch[1].trim();
      }

      // AI Insight
      if (lowerLine.includes('ai insight')) {
        const insightMatch = line.match(/AI Insight:\s*(.*)/i);
        if (insightMatch) report.aiInsight = insightMatch[1].trim();
      }

      // AI Descriptions
      if (lowerLine.includes('description - sustainability score')) {
        const descMatch = line.match(/Description - Sustainability Score:\s*(.*)/i);
        if (descMatch) report.aiDescriptions.sustainabilityScore = descMatch[1].trim();
      }
      if (lowerLine.includes('description - carbon footprint') || lowerLine.includes('description - co₂') || lowerLine.includes('description - emissions')) {
        const descMatch = line.match(/Description - Carbon Footprint:\s*(.*)/i);
        if (descMatch) report.aiDescriptions.impactMetrics.push({ name: 'Carbon Footprint', description: descMatch[1].trim() });
      }
      if (lowerLine.includes('description - water') && (lowerLine.includes('usage') || lowerLine.includes('consumption'))) {
        const descMatch = line.match(/Description - Water Usage:\s*(.*)/i);
        if (descMatch) report.aiDescriptions.impactMetrics.push({ name: 'Water Usage', description: descMatch[1].trim() });
      }
      if (lowerLine.includes('description - energy') && (lowerLine.includes('consumption') || lowerLine.includes('usage'))) {
        const descMatch = line.match(/Description - Energy Consumption:\s*(.*)/i);
        if (descMatch) report.aiDescriptions.impactMetrics.push({ name: 'Energy Consumption', description: descMatch[1].trim() });
      }
      if (lowerLine.includes('description - materials impact')) {
        const descMatch = line.match(/Description - Materials Impact:\s*(.*)/i);
        if (descMatch) report.aiDescriptions.materialsImpact = descMatch[1].trim();
      }
      if (lowerLine.includes('description - lifecycle impact')) {
        const descMatch = line.match(/Description - Lifecycle Impact:\s*(.*)/i);
        if (descMatch) report.aiDescriptions.lifecycleImpact = descMatch[1].trim();
      }
      if (lowerLine.includes('description - eco tip')) {
        const descMatch = line.match(/Description - Eco Tip:\s*(.*)/i);
        if (descMatch) report.aiDescriptions.ecoTip = descMatch[1].trim();
      }
      if (lowerLine.includes('description - ai insight')) {
        const descMatch = line.match(/Description - AI Insight:\s*(.*)/i);
        if (descMatch) report.aiDescriptions.aiInsight = descMatch[1].trim();
      }
    });

    // Fallbacks if data is missing
    if (!report.summary) {
      report.summary = `Your ${productInput} has a ${
        report.sustainabilityScore.value >= 7 ? 'low' : report.sustainabilityScore.value >= 4 ? 'moderate' : 'high'
      } environmental impact. Here’s how to improve it.`;
    }
    if (!report.sustainabilityScore.value) {
      report.sustainabilityScore.value = 5; // Default to average
    }
    if (report.impactMetrics.length === 0) {
      report.impactMetrics.push({ name: 'Carbon Footprint', value: 10, unit: 'kg CO₂e', max: 50 });
    }
    if (report.materialsImpact.length === 0) {
      report.materialsImpact.push({ 
        name: 'Unknown Material', 
        percentage: 100, 
        impact: 'Medium',
        description: 'Material data unavailable; consider researching product composition.'
      });
    }
    if (report.lifecycleImpact.length === 0) {
      report.lifecycleImpact.push(
        { stage: 'Manufacturing', percentage: 50, impact: 'Medium', description: 'Moderate energy use during production.' },
        { stage: 'Usage', percentage: 30, impact: 'Low', description: 'Low energy consumption during use.' },
        { stage: 'Disposal', percentage: 20, impact: 'High', description: 'Challenging to recycle.' }
      );
    }
    if (!report.ecoTip) {
      report.ecoTip = 'Use sustainably to reduce impact.';
    }
    if (!report.aiInsight) {
      report.aiInsight = 'Reduce usage to lower environmental impact.';
    }
    // Fallbacks for AI Descriptions
    if (!report.aiDescriptions.sustainabilityScore) {
      report.aiDescriptions.sustainabilityScore = 'A glowing badge of your product’s green heart!';
    }
    if (report.aiDescriptions.impactMetrics.length === 0) {
      report.aiDescriptions.impactMetrics.push({ 
        name: 'Carbon Footprint', 
        description: 'Like a weekend road trip’s carbon trail!' 
      });
    }
    if (!report.aiDescriptions.materialsImpact) {
      report.aiDescriptions.materialsImpact = 'The building blocks of your product’s eco-story.';
    }
    if (!report.aiDescriptions.lifecycleImpact) {
      report.aiDescriptions.lifecycleImpact = 'A journey through your product’s eco-life stages.';
    }
    if (!report.aiDescriptions.ecoTip) {
      report.aiDescriptions.ecoTip = 'A whisper of wisdom for a greener tomorrow.';
    }
    if (!report.aiDescriptions.aiInsight) {
      report.aiDescriptions.aiInsight = 'A spark of genius to lighten your eco-load.';
    }

  } catch (error) {
    console.error('Error parsing Gemini response:', error.message);
    report.summary = `Your ${productInput} has an unknown environmental impact.`;
    report.sustainabilityScore = { value: 5, max: 10 };
    report.impactMetrics = [{ name: 'Carbon Footprint', value: 10, unit: 'kg CO₂e', max: 50 }];
    report.materialsImpact = [{ 
      name: 'Unknown Material', 
      percentage: 100, 
      impact: 'Medium',
      description: 'Material data unavailable; consider researching product composition.'
    }];
    report.lifecycleImpact = [
      { stage: 'Manufacturing', percentage: 50, impact: 'Medium', description: 'Moderate energy use during production.' },
      { stage: 'Usage', percentage: 30, impact: 'Low', description: 'Low energy consumption during use.' },
      { stage: 'Disposal', percentage: 20, impact: 'High', description: 'Challenging to recycle.' }
    ];
    report.ecoTip = 'Use sustainably to reduce impact.';
    report.aiInsight = 'Analysis unavailable due to parsing error.';
    report.aiDescriptions = {
      sustainabilityScore: 'A glowing badge of your product’s green heart!',
      impactMetrics: [{ name: 'Carbon Footprint', description: 'Like a weekend road trip’s carbon trail!' }],
      materialsImpact: 'The building blocks of your product’s eco-story.',
      lifecycleImpact: 'A journey through your product’s eco-life stages.',
      ecoTip: 'A whisper of wisdom for a greener tomorrow.',
      aiInsight: 'A spark of genius to lighten your eco-load.',
    };
  }

  return report;
}

// Route to analyze product
app.post('/api/analyze', async (req, res) => {
  const { productLink, productDescription } = req.body;

  // Validate input
  if (!productLink && !productDescription) {
    console.log('Validation failed: No product link or description provided');
    return res.status(400).json({ error: 'Please provide a product link or description' });
  }

  try {
    console.log('Received request:', { productLink, productDescription });

    // Check in-memory cache
    const cacheKey = JSON.stringify({ productLink, productDescription });
    const cachedResult = cache.get(cacheKey);
    if (cachedResult && (Date.now() - cachedResult.timestamp < CACHE_DURATION)) {
      console.log('Returning cached result');
      return res.json(cachedResult.report);
    }

    // Prepare the prompt for Gemini API
    let promptInput = productDescription || '';
    let productName = productDescription || 'product';

    // Scrape product details if a URL is provided
    if (productLink) {
      console.log('Scraping product details from URL:', productLink);
      const scrapedData = await scrapeProductDetails(productLink);
      if (scrapedData) {
        promptInput = scrapedData;
        productName = scrapedData.split('.')[0] || 'product';
        console.log('Scraped data:', scrapedData);
      } else {
        console.log('Failed to scrape product details');
        return res.status(400).json({ error: 'Failed to scrape product details from the provided URL' });
      }
    }

    // Construct the prompt for Gemini API (concise, no markdown)
    const prompt = `
      Analyze the environmental impact of this product: ${promptInput}.
      Provide a concise report in plain text with the following sections (keep each response to 1-2 short sentences, no markdown like ** or *):
      Summary: A one-sentence summary of the product's environmental impact.
      Sustainability Score: A score out of 10 (e.g., 7/10).
      Carbon Footprint: Estimated carbon footprint in kg CO₂e (e.g., 20 kg CO₂e).
      Water Usage: Estimated water usage in liters (e.g., 1500 liters).
      Materials Impact: List of materials with percentages, impact, and a short description (e.g., Recycled Aluminum (75%) - Low - Sourced sustainably, Plastic (25%) - High - Non-biodegradable).
      Lifecycle Impact: List of lifecycle stages with percentages, impact, and a short description (e.g., Manufacturing: 40% - High - Energy-intensive, Usage: 30% - Low - Minimal energy use, Disposal: 30% - Medium - Partially recyclable).
      Eco Tip: A one-sentence eco tip.
      AI Insight: A one-sentence actionable insight for reducing impact.
      Description - Sustainability Score: A creative one-sentence description of what the sustainability score means.
      Description - Carbon Footprint: A creative one-sentence description of the carbon footprint.
      Description - Water Usage: A creative one-sentence description of the water usage.
      Description - Materials Impact: A creative one-sentence description of the materials impact.
      Description - Lifecycle Impact: A creative one-sentence description of the lifecycle impact.
      Description - Eco Tip: A creative one-sentence description of the eco tip.
      Description - AI Insight: A creative one-sentence description of the AI insight.
    `;

    // Call Gemini API
    console.log('Calling Gemini API with prompt:', prompt.substring(0, 100) + '...');
    let geminiResponse;
    try {
      geminiResponse = await callGeminiAPI(prompt);
    } catch (error) {
      console.error('Gemini API failed:', error.message);
      return res.json({
        summary: `Your ${productName} has an unknown environmental impact.`,
        sustainabilityScore: { value: 5, max: 10 },
        impactMetrics: [{ name: 'Carbon Footprint', value: 10, unit: 'kg CO₂e', max: 50 }],
        materialsImpact: [{ 
          name: 'Unknown Material', 
          percentage: 100, 
          impact: 'Medium',
          description: 'Material data unavailable; consider researching product composition.'
        }],
        lifecycleImpact: [
          { stage: 'Manufacturing', percentage: 50, impact: 'Medium', description: 'Moderate energy use during production.' },
          { stage: 'Usage', percentage: 30, impact: 'Low', description: 'Low energy consumption during use.' },
          { stage: 'Disposal', percentage: 20, impact: 'High', description: 'Challenging to recycle.' }
        ],
        ecoTip: 'Use sustainably to reduce impact.',
        aiInsight: 'Analysis unavailable due to API error.',
        aiDescriptions: {
          sustainabilityScore: 'A glowing badge of your product’s green heart!',
          impactMetrics: [{ name: 'Carbon Footprint', description: 'Like a weekend road trip’s carbon trail!' }],
          materialsImpact: 'The building blocks of your product’s eco-story.',
          lifecycleImpact: 'A journey through your product’s eco-life stages.',
          ecoTip: 'A whisper of wisdom for a greener tomorrow.',
          aiInsight: 'A spark of genius to lighten your eco-load.',
        },
      });
    }
    console.log('Gemini API response:', geminiResponse);

    // Parse the response
    console.log('Parsing Gemini response');
    const report = parseGeminiResponse(geminiResponse, productName);
    console.log('Parsed report:', JSON.stringify(report, null, 2));

    // Store in cache
    cache.set(cacheKey, { report, timestamp: Date.now() });

    res.json(report);
  } catch (error) {
    console.error('Error in /api/analyze:', error.message, error.stack);
    res.status(500).json({
      summary: 'An unexpected error occurred.',
      sustainabilityScore: { value: 5, max: 10 },
      impactMetrics: [{ name: 'Carbon Footprint', value: 10, unit: 'kg CO₂e', max: 50 }],
      materialsImpact: [{ 
        name: 'Unknown Material', 
        percentage: 100, 
        impact: 'Medium',
        description: 'Material data unavailable; consider researching product composition.'
      }],
      lifecycleImpact: [
        { stage: 'Manufacturing', percentage: 50, impact: 'Medium', description: 'Moderate energy use during production.' },
        { stage: 'Usage', percentage: 30, impact: 'Low', description: 'Low energy consumption during use.' },
        { stage: 'Disposal', percentage: 20, impact: 'High', description: 'Challenging to recycle.' }
      ],
      ecoTip: 'Use sustainably to reduce impact.',
      aiInsight: 'Analysis unavailable due to server error.',
      aiDescriptions: {
        sustainabilityScore: 'A glowing badge of your product’s green heart!',
        impactMetrics: [{ name: 'Carbon Footprint', description: 'Like a weekend road trip’s carbon trail!' }],
        materialsImpact: 'The building blocks of your product’s eco-story.',
        lifecycleImpact: 'A journey through your product’s eco-life stages.',
        ecoTip: 'A whisper of wisdom for a greener tomorrow.',
        aiInsight: 'A spark of genius to lighten your eco-load.',
      },
    });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});