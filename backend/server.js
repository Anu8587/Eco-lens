const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const puppeteer = require('puppeteer');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const cache = new Map();
const CACHE_DURATION = 60 * 60 * 1000;

const scrapeProductDetails = async (url, retries = 2) => {
  // Helper to clean text
  const cleanText = (text) => text?.replace(/\s+/g, ' ').trim() || '';

  // Static scraping with Cheerio
  const scrapeWithCheerio = async () => {
    try {
      const { data } = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        },
        timeout: 10000,
      });
      const $ = cheerio.load(data);

      const selectors = {
        title: [
          'h1',
          '#productTitle',
          '.product-title',
          '[data-testid="product-title"]',
          'h2',
          '.title',
          '.product-name',
          '[itemprop="name"]',
        ],
        description: [
          '#productDescription',
          '.product-description',
          '[data-testid="pdp-description"]',
          '#feature-bullets',
          '.a-section.a-spacing-medium',
          '[itemprop="description"]',
          '.description',
          '.product-details',
        ],
        materials: [
          '[data-testid="materials"]',
          '.materials',
          '.composition',
          '#productDetails_techSpec_section_1',
          '.product-specs',
          '.material-info',
          '[data-material]',
        ],
        certifications: [
          '.certifications',
          '[data-testid="certifications"]',
          '.product-certification',
          '.eco-labels',
          '.sustainability-info',
          '[data-certification]',
        ],
        category: [
          '.breadcrumb a',
          '.nav-breadcrumb li',
          '[data-testid="breadcrumb"]',
          'meta[name="keywords"]',
          'meta[name="description"]',
        ],
      };

      const getText = (selectorArray) => {
        for (const selector of selectorArray) {
          let text = '';
          if (selector.includes('meta')) {
            const attr = selector.includes('keywords') ? 'keywords' : 'description';
            text = $(`meta[name="${attr}"]`).attr('content') || '';
          } else {
            text = $(selector).map((i, el) => $(el).text().trim()).get().join(' ');
          }
          if (text) return cleanText(text);
        }
        return '';
      };

      const title = getText(selectors.title) || 'Unknown Product';
      const description = getText(selectors.description) || '';
      const materials = getText(selectors.materials) || '';
      const certifications = getText(selectors.certifications) || '';
      const category = getText(selectors.category) || '';

      // Infer product category from text
      const inferCategory = (text) => {
        const lowerText = text.toLowerCase();
        if (lowerText.includes('clothing') || lowerText.includes('shirt') || lowerText.includes('dress')) return 'Clothing';
        if (lowerText.includes('electronics') || lowerText.includes('phone') || lowerText.includes('laptop')) return 'Electronics';
        if (lowerText.includes('furniture') || lowerText.includes('table') || lowerText.includes('chair')) return 'Furniture';
        if (lowerText.includes('food') || lowerText.includes('beverage') || lowerText.includes('organic')) return 'Food & Beverage';
        return 'General';
      };

      const inferredCategory = inferCategory(`${title} ${description} ${category}`);

      return {
        title,
        description,
        materials,
        certifications,
        category: inferredCategory,
        raw: `${title}. ${description}. Materials: ${materials}. Certifications: ${certifications}.`.trim(),
      };
    } catch (error) {
      console.error(`Cheerio scraping error for ${url}:`, error.message);
      return null;
    }
  };

  // Dynamic scraping with Puppeteer
  const scrapeWithPuppeteer = async () => {
    let browser;
    try {
      browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
      const page = await browser.newPage();
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 15000 });

      const data = await page.evaluate(() => {
        const cleanText = (text) => text?.replace(/\s+/g, ' ').trim() || '';
        const getText = (selectors) => {
          for (const sel of selectors) {
            const el = document.querySelector(sel);
            if (el) return cleanText(el.textContent || el.getAttribute('content') || '');
          }
          return '';
        };

        const selectors = {
          title: ['h1', '#productTitle', '.product-title', '[data-testid="product-title"]'],
          description: ['#productDescription', '.product-description', '#feature-bullets', '[itemprop="description"]'],
          materials: ['[data-testid="materials"]', '.materials', '.composition', '.product-specs'],
          certifications: ['.certifications', '[data-testid="certifications"]', '.eco-labels'],
          category: ['.breadcrumb', 'meta[name="keywords"]', 'meta[name="description"]'],
        };

        const title = getText(selectors.title) || 'Unknown Product';
        const description = getText(selectors.description) || '';
        const materials = getText(selectors.materials) || '';
        const certifications = getText(selectors.certifications) || '';
        const category = getText(selectors.category) || '';

        return { title, description, materials, certifications, category, raw: `${title}. ${description}. Materials: ${materials}. Certifications: ${certifications}.`.trim() };
      });

      // Infer category
      const inferCategory = (text) => {
        const lowerText = text.toLowerCase();
        if (lowerText.includes('clothing') || lowerText.includes('shirt') || lowerText.includes('dress')) return 'Clothing';
        if (lowerText.includes('electronics') || lowerText.includes('phone') || lowerText.includes('laptop')) return 'Electronics';
        if (lowerText.includes('furniture') || lowerText.includes('table') || lowerText.includes('chair')) return 'Furniture';
        if (lowerText.includes('food') || lowerText.includes('beverage') || lowerText.includes('organic')) return 'Food & Beverage';
        return 'General';
      };

      data.category = inferCategory(`${data.title} ${data.description} ${data.category}`);
      await browser.close();
      return data;
    } catch (error) {
      console.error(`Puppeteer scraping error for ${url}:`, error.message);
      return null;
    } finally {
      if (browser) await browser.close();
    }
  };

  // Try Cheerio first, then Puppeteer if needed
  for (let i = 0; i < retries; i++) {
    let result = await scrapeWithCheerio();
    if (result && result.raw) {
      console.log(`Scraping successful for ${url} (Cheerio, attempt ${i + 1})`);
      return result;
    }

    result = await scrapeWithPuppeteer();
    if (result && result.raw) {
      console.log(`Scraping successful for ${url} (Puppeteer, attempt ${i + 1})`);
      return result;
    }

    if (i < retries - 1) {
      console.log(`Retrying scraping for ${url} (attempt ${i + 2})`);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  console.error(`Scraping failed for ${url} after ${retries} attempts`);
  return { title: 'Unknown Product', description: '', materials: '', certifications: '', category: 'General', raw: 'No data available.' };
};

const callGeminiAPI = async (prompt) => {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${process.env.GEMINI_API_KEY}`;
  try {
    const response = await axios.post(
      url,
      { contents: [{ parts: [{ text: prompt }] }] },
      { headers: { 'Content-Type': 'application/json' }, timeout: 15000 }
    );
    return response.data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error('Gemini API error:', error.message);
    throw new Error('Failed to analyze product with Gemini API');
  }
};

const parseGeminiResponse = (text, productInput, category) => {
  let report = {
    summary: '',
    sustainabilityScore: { value: null, max: 10 },
    impactMetrics: [],
    materialsImpact: [],
    lifecycleImpact: [],
    certifications: [],
    ecoTip: '',
    aiInsight: '',
    aiDescriptions: {
      sustainabilityScore: '',
      impactMetrics: [],
      materialsImpact: '',
      lifecycleImpact: '',
      certifications: '',
      ecoTip: '',
      aiInsight: '',
    },
  };

  try {
    const lines = text.split('\n').map(line => line.trim()).filter(line => line);

    const extractMetric = (text, units, defaultMax) => {
      for (const unit of units) {
        const match = text.match(new RegExp(`~?(\\d+\\.?\\d*)\\s*${unit}`, 'i'));
        if (match) return { value: parseFloat(match[1]), unit, max: defaultMax };
      }
      return null;
    };

    const extractPercentageList = text => {
      const items = text.matchAll(/(.*?)\s*\((\d+)%\)\s*-\s*(Low|High|Medium)\s*-\s*(.*?)(?=\n|$)/gi);
      return Array.from(items, match => ({
        name: match[1].trim(),
        percentage: parseInt(match[2]),
        impact: match[3],
        description: match[4].trim(),
      }));
    };

    const extractLifecycleStages = text => {
      const items = text.matchAll(/(.*?):\s*(\d+)%\s*-\s*(Low|High|Medium)\s*-\s*(.*?)(?=\n|$)/gi);
      return Array.from(items, match => ({
        stage: match[1].trim(),
        percentage: parseInt(match[2]),
        impact: match[3],
        description: match[4].trim(),
      }));
    };

    const extractCertifications = text => {
      const items = text.matchAll(/(.*?)\s*-\s*(.*?)(?=\n|$)/gi);
      return Array.from(items, match => ({
        name: match[1].trim(),
        description: match[2].trim(),
      }));
    };

    const extractScore = text => {
      const match = text.match(/(\d+)\/(\d+)/);
      if (match) return { value: parseInt(match[1]), max: parseInt(match[2]) };
      return null;
    };

    const seenMetrics = new Set();
    lines.forEach(line => {
      const lowerLine = line.toLowerCase();

      if (lowerLine.includes('summary')) {
        const match = line.match(/Summary:\s*(.*)/i);
        if (match) report.summary = match[1].trim();
      }
      if (lowerLine.includes('sustainability score')) {
        const score = extractScore(line);
        if (score) report.sustainabilityScore = score;
      }
      if (lowerLine.includes('carbon footprint') || lowerLine.includes('co₂') || lowerLine.includes('emissions')) {
        if (!seenMetrics.has('Carbon Footprint')) {
          const metric = extractMetric(line, ['kg CO₂e', 'kg CO2e', 'kg CO₂'], category === 'Clothing' ? 30 : category === 'Electronics' ? 100 : 50);
          if (metric) {
            report.impactMetrics.push({ name: 'Carbon Footprint', ...metric });
            seenMetrics.add('Carbon Footprint');
          }
        }
      }
      if (lowerLine.includes('water') && (lowerLine.includes('usage') || lowerLine.includes('consumption'))) {
        if (!seenMetrics.has('Water Usage')) {
          const metric = extractMetric(line, ['liters', 'litres'], category === 'Clothing' ? 5000 : category === 'Food & Beverage' ? 1000 : 2000);
          if (metric) {
            report.impactMetrics.push({ name: 'Water Usage', ...metric });
            seenMetrics.add('Water Usage');
          }
        }
      }
      if (lowerLine.includes('energy') && (lowerLine.includes('consumption') || lowerLine.includes('usage'))) {
        if (!seenMetrics.has('Energy Consumption')) {
          const metric = extractMetric(line, ['kWh', 'kwh'], category === 'Electronics' ? 200 : category === 'Furniture' ? 50 : 100);
          if (metric) {
            report.impactMetrics.push({ name: 'Energy Consumption', ...metric });
            seenMetrics.add('Energy Consumption');
          }
        }
      }
      if (lowerLine.includes('materials impact')) {
        const materials = extractPercentageList(line);
        if (materials.length > 0) report.materialsImpact = materials;
      }
      if (lowerLine.includes('lifecycle impact')) {
        const lifecycle = extractLifecycleStages(line);
        if (lifecycle.length > 0) report.lifecycleImpact = lifecycle;
      }
      if (lowerLine.includes('certifications')) {
        const certs = extractCertifications(line);
        if (certs.length > 0) report.certifications = certs;
      }
      if (lowerLine.includes('eco tip')) {
        const match = line.match(/Eco Tip:\s*(.*)/i);
        if (match) report.ecoTip = match[1].trim();
      }
      if (lowerLine.includes('ai insight')) {
        const match = line.match(/AI Insight:\s*(.*)/i);
        if (match) report.aiInsight = match[1].trim();
      }
      if (lowerLine.includes('description - sustainability score')) {
        const match = line.match(/Description - Sustainability Score:\s*(.*)/i);
        if (match) report.aiDescriptions.sustainabilityScore = match[1].trim();
      }
      if (lowerLine.includes('description - carbon footprint')) {
        const match = line.match(/Description - Carbon Footprint:\s*(.*)/i);
        if (match) report.aiDescriptions.impactMetrics.push({ name: 'Carbon Footprint', description: match[1].trim() });
      }
      if (lowerLine.includes('description - water usage')) {
        const match = line.match(/Description - Water Usage:\s*(.*)/i);
        if (match) report.aiDescriptions.impactMetrics.push({ name: 'Water Usage', description: match[1].trim() });
      }
      if (lowerLine.includes('description - energy consumption')) {
        const match = line.match(/Description - Energy Consumption:\s*(.*)/i);
        if (match) report.aiDescriptions.impactMetrics.push({ name: 'Energy Consumption', description: match[1].trim() });
      }
      if (lowerLine.includes('description - materials impact')) {
        const match = line.match(/Description - Materials Impact:\s*(.*)/i);
        if (match) report.aiDescriptions.materialsImpact = match[1].trim();
      }
      if (lowerLine.includes('description - lifecycle impact')) {
        const match = line.match(/Description - Lifecycle Impact:\s*(.*)/i);
        if (match) report.aiDescriptions.lifecycleImpact = match[1].trim();
      }
      if (lowerLine.includes('description - certifications')) {
        const match = line.match(/Description - Certifications:\s*(.*)/i);
        if (match) report.aiDescriptions.certifications = match[1].trim();
      }
      if (lowerLine.includes('description - eco tip')) {
        const match = line.match(/Description - Eco Tip:\s*(.*)/i);
        if (match) report.aiDescriptions.ecoTip = match[1].trim();
      }
      if (lowerLine.includes('description - ai insight')) {
        const match = line.match(/Description - AI Insight:\s*(.*)/i);
        if (match) report.aiDescriptions.aiInsight = match[1].trim();
      }
    });

    // Ensure standardized lifecycle stages
    const standardStages = ['Sourcing', 'Manufacturing', 'Usage', 'Disposal'];
    const existingStages = report.lifecycleImpact.map(s => s.stage);
    const missingStages = standardStages.filter(s => !existingStages.includes(s));
    missingStages.forEach(stage => {
      report.lifecycleImpact.push({
        stage,
        percentage: 25,
        impact: 'Medium',
        description: `Assumed ${stage.toLowerCase()} impact based on ${category} industry norms.`,
      });
    });

    // Fallbacks
    if (!report.summary) {
      report.summary = `The ${productInput} has a ${
        report.sustainabilityScore.value >= 7 ? 'low' : report.sustainabilityScore.value >= 4 ? 'moderate' : 'high'
      } environmental impact based on ${category} standards.`;
    }
    if (!report.sustainabilityScore.value) {
      report.sustainabilityScore = { value: category === 'Clothing' ? 6 : category === 'Electronics' ? 4 : 5, max: 10 };
    }
    if (report.impactMetrics.length === 0) {
      report.impactMetrics.push({ name: 'Carbon Footprint', value: category === 'Clothing' ? 15 : 25, unit: 'kg CO₂e', max: category === 'Clothing' ? 30 : 50 });
    }
    if (report.materialsImpact.length === 0) {
      report.materialsImpact.push({
        name: 'Unknown Material',
        percentage: 100,
        impact: 'Medium',
        description: `Material data unavailable; assumed based on ${category} products.`,
      });
    }
    if (report.certifications.length === 0) {
      report.certifications.push({
        name: 'None Identified',
        description: `No eco-certifications found for this ${category} product.`,
      });
    }
    if (!report.ecoTip) {
      report.ecoTip = category === 'Clothing' ? 'Wash in cold water to save energy.' : 'Choose energy-efficient usage to reduce impact.';
    }
    if (!report.aiInsight) {
      report.aiInsight = category === 'Electronics' ? 'Opt for recyclable components to enhance sustainability.' : 'Explore sustainable sourcing to reduce impact.';
    }
    if (!report.aiDescriptions.sustainabilityScore) {
      report.aiDescriptions.sustainabilityScore = `A measure of eco-friendliness for this ${category} product.`;
    }
    if (report.aiDescriptions.impactMetrics.length === 0) {
      report.aiDescriptions.impactMetrics.push({
        name: 'Carbon Footprint',
        description: `The carbon footprint of this ${category} product’s lifecycle.`,
      });
    }
    if (!report.aiDescriptions.materialsImpact) {
      report.aiDescriptions.materialsImpact = `The environmental impact of materials in this ${category} product.`;
    }
    if (!report.aiDescriptions.lifecycleImpact) {
      report.aiDescriptions.lifecycleImpact = `The lifecycle impact across this ${category} product’s stages.`;
    }
    if (!report.aiDescriptions.certifications) {
      report.aiDescriptions.certifications = `Eco-credentials for this ${category} product.`;
    }
    if (!report.aiDescriptions.ecoTip) {
      report.aiDescriptions.ecoTip = `A practical step for sustainable use of this ${category} product.`;
    }
    if (!report.aiDescriptions.aiInsight) {
      report.aiDescriptions.aiInsight = `Strategic advice for improving this ${category} product’s sustainability.`;
    }
  } catch (error) {
    console.error('Parsing error:', error.message);
    report = {
      summary: `The ${productInput} has an unknown environmental impact in the ${category} category.`,
      sustainabilityScore: { value: 5, max: 10 },
      impactMetrics: [{ name: 'Carbon Footprint', value: 25, unit: 'kg CO₂e', max: 50 }],
      materialsImpact: [{
        name: 'Unknown Material',
        percentage: 100,
        impact: 'Medium',
        description: 'Material data unavailable.',
      }],
      lifecycleImpact: [
        { stage: 'Sourcing', percentage: 25, impact: 'Medium', description: 'Assumed sourcing impact.' },
        { stage: 'Manufacturing', percentage: 25, impact: 'Medium', description: 'Assumed manufacturing impact.' },
        { stage: 'Usage', percentage: 25, impact: 'Low', description: 'Assumed low usage impact.' },
        { stage: 'Disposal', percentage: 25, impact: 'High', description: 'Assumed disposal impact.' },
      ],
      certifications: [{ name: 'None Identified', description: 'No eco-certifications found.' }],
      ecoTip: 'Choose reusable alternatives to reduce impact.',
      aiInsight: 'Explore sustainable sourcing options.',
      aiDescriptions: {
        sustainabilityScore: 'A snapshot of your product’s eco-credentials.',
        impactMetrics: [{ name: 'Carbon Footprint', description: 'The carbon trail of your product’s journey.' }],
        materialsImpact: 'The eco-story behind your product’s materials.',
        lifecycleImpact: 'The environmental journey of your product.',
        certifications: 'Badges of your product’s eco-credentials.',
        ecoTip: 'A practical step toward a greener future.',
        aiInsight: 'Smart insights for sustainable choices.',
      },
    };
  }
  return report;
};

app.post('/api/analyze', async (req, res) => {
  const { productLink, productDescription } = req.body;

  if (!productLink && !productDescription) {
    return res.status(400).json({ error: 'Please provide a product link or description' });
  }

  try {
    const cacheKey = JSON.stringify({ productLink, productDescription });
    const cachedResult = cache.get(cacheKey);
    if (cachedResult && (Date.now() - cachedResult.timestamp < CACHE_DURATION)) {
      return res.json(cachedResult.report);
    }

    let promptInput = productDescription || '';
    let productName = productDescription || 'product';
    let category = 'General';

    if (productLink) {
      const scrapedData = await scrapeProductDetails(productLink);
      if (scrapedData.raw) {
        promptInput = scrapedData.raw;
        productName = scrapedData.title;
        category = scrapedData.category;
      } else {
        return res.status(400).json({ error: 'Failed to scrape product details from the provided URL' });
      }
    } else if (productDescription) {
      // Infer category from description
      const inferCategory = (text) => {
        const lowerText = text.toLowerCase();
        if (lowerText.includes('clothing') || lowerText.includes('shirt') || lowerText.includes('dress')) return 'Clothing';
        if (lowerText.includes('electronics') || lowerText.includes('phone') || lowerText.includes('laptop')) return 'Electronics';
        if (lowerText.includes('furniture') || lowerText.includes('table') || lowerText.includes('chair')) return 'Furniture';
        if (lowerText.includes('food') || lowerText.includes('beverage') || lowerText.includes('organic')) return 'Food & Beverage';
        return 'General';
      };
      category = inferCategory(productDescription);
    }

    const prompt = `
      Analyze the environmental impact of this ${category} product: ${promptInput}.
      Provide a concise, accurate report based on industry standards or scientific data where possible.
      If data is missing, use conservative estimates based on typical ${category} products and indicate assumptions (e.g., "Assumed based on industry averages").
      Avoid speculative or unverified claims.
      Return the response in plain text with the following sections, using exact formats:
      Summary: [1-2 sentences summarizing the product's environmental impact]
      Sustainability Score: [X/10, e.g., 7/10]
      Carbon Footprint: [X kg CO₂e, e.g., 20 kg CO₂e]
      Water Usage: [X liters, e.g., 1500 liters]
      Energy Consumption: [X kWh, e.g., 50 kWh]
      Materials Impact: [List materials, e.g., Recycled Cotton (60%) - Low - Sustainably sourced, Plastic (40%) - High - Non-biodegradable]
      Lifecycle Impact: [List stages, e.g., Sourcing: 20% - Medium - Moderate resource use, Manufacturing: 30% - High - Energy-intensive]
      Certifications: [List certifications, e.g., Fair Trade - Ensures ethical labor practices, Organic - Certified organic materials]
      Eco Tip: [Practical user action, e.g., Wash in cold water to save energy]
      AI Insight: [Strategic suggestion, e.g., Switch to biodegradable packaging]
      Description - Sustainability Score: [Creative 1-sentence description]
      Description - Carbon Footprint: [Creative 1-sentence description]
      Description - Water Usage: [Creative 1-sentence description]
      Description - Energy Consumption: [Creative 1-sentence description]
      Description - Materials Impact: [Creative 1-sentence description]
      Description - Lifecycle Impact: [Creative 1-sentence description]
      Description - Certifications: [Creative 1-sentence description]
      Description - Eco Tip: [Creative 1-sentence description]
      Description - AI Insight: [Creative 1-sentence description]
    `;

    let geminiResponse;
    try {
      geminiResponse = await callGeminiAPI(prompt);
    } catch (error) {
      console.error('Gemini API failed, using fallback');
      return res.json({
        summary: `The ${productName} has an unknown environmental impact in the ${category} category.`,
        sustainabilityScore: { value: 5, max: 10 },
        impactMetrics: [{ name: 'Carbon Footprint', value: 25, unit: 'kg CO₂e', max: 50 }],
        materialsImpact: [{
          name: 'Unknown Material',
          percentage: 100,
          impact: 'Medium',
          description: 'Material data unavailable.',
        }],
        lifecycleImpact: [
          { stage: 'Sourcing', percentage: 25, impact: 'Medium', description: 'Assumed sourcing impact.' },
          { stage: 'Manufacturing', percentage: 25, impact: 'Medium', description: 'Assumed manufacturing impact.' },
          { stage: 'Usage', percentage: 25, impact: 'Low', description: 'Assumed low usage impact.' },
          { stage: 'Disposal', percentage: 25, impact: 'High', description: 'Assumed disposal impact.' },
        ],
        certifications: [{ name: 'None Identified', description: 'No eco-certifications found.' }],
        ecoTip: 'Choose reusable alternatives to reduce impact.',
        aiInsight: 'Explore sustainable sourcing options.',
        aiDescriptions: {
          sustainabilityScore: 'A snapshot of your product’s eco-credentials.',
          impactMetrics: [{ name: 'Carbon Footprint', description: 'The carbon trail of your product’s journey.' }],
          materialsImpact: 'The eco-story behind your product’s materials.',
          lifecycleImpact: 'The environmental journey of your product.',
          certifications: 'Badges of your product’s eco-credentials.',
          ecoTip: 'A practical step toward a greener future.',
          aiInsight: 'Smart insights for sustainable choices.',
        },
      });
    }

    const report = parseGeminiResponse(geminiResponse, productName, category);
    cache.set(cacheKey, { report, timestamp: Date.now() });
    res.json(report);
  } catch (error) {
    console.error('Error in /api/analyze:', error.message);
    res.status(500).json({
      summary: 'An unexpected error occurred.',
      sustainabilityScore: { value: 5, max: 10 },
      impactMetrics: [{ name: 'Carbon Footprint', value: 25, unit: 'kg CO₂e', max: 50 }],
      materialsImpact: [{
        name: 'Unknown Material',
        percentage: 100,
        impact: 'Medium',
        description: 'Material data unavailable.',
      }],
      lifecycleImpact: [
        { stage: 'Sourcing', percentage: 25, impact: 'Medium', description: 'Assumed sourcing impact.' },
        { stage: 'Manufacturing', percentage: 25, impact: 'Medium', description: 'Assumed manufacturing impact.' },
        { stage: 'Usage', percentage: 25, impact: 'Low', description: 'Assumed low usage impact.' },
        { stage: 'Disposal', percentage: 25, impact: 'High', description: 'Assumed disposal impact.' },
      ],
      certifications: [{ name: 'None Identified', description: 'No eco-certifications found.' }],
      ecoTip: 'Choose reusable alternatives to reduce impact.',
      aiInsight: 'Explore sustainable sourcing options.',
      aiDescriptions: {
        sustainabilityScore: 'A snapshot of your product’s eco-credentials.',
        impactMetrics: [{ name: 'Carbon Footprint', description: 'The carbon trail of your product’s journey.' }],
        materialsImpact: 'The eco-story behind your product’s materials.',
        lifecycleImpact: 'The environmental journey of your product.',
        certifications: 'Badges of your product’s eco-credentials.',
        ecoTip: 'A practical step toward a greener future.',
        aiInsight: 'Smart insights for sustainable choices.',
      },
    });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});