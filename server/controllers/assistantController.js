import { 
  queryMedicalAssistant, 
  identifyPillFromImage,
  isMedicalQuery 
} from '../services/aiAssistantService.js';

/**
 * @desc    Chat with AI medical assistant
 * @route   POST /api/assistant/chat
 * @access  Public
 */
export const chatWithAssistant = async (req, res) => {
  try {
    const { query, conversationHistory = [] } = req.body;

    if (!query || typeof query !== 'string' || query.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Query is required and must be a non-empty string'
      });
    }

    console.log(`\n💬 Chat Request: "${query.substring(0, 100)}..."`);

    // Quick check if query is medical-related
    if (!isMedicalQuery(query)) {
      console.log('⚠️ Non-medical query detected');
      return res.status(200).json({
        success: true,
        data: {
          query,
          intent: 'out_of_scope',
          result: {},
          evidence: [],
          confidence_score: 0,
          summary: "I don't know"
        },
        source: 'scope_filter'
      });
    }

    // Query OpenRouter AI
    const result = await queryMedicalAssistant(query, conversationHistory);

    if (result.success) {
      // Check if AI responded with out_of_scope or "I don't know"
      if (result.data.intent === 'out_of_scope' || 
          (result.data.summary && result.data.summary.toLowerCase().includes("i don't know"))) {
        console.log('🚫 AI determined query is out of scope');
      }

      return res.status(200).json({
        success: true,
        data: result.data,
        usage: result.usage,
        source: 'openrouter'
      });
    } else {
      return res.status(500).json({
        success: false,
        message: result.error || 'AI assistant error',
        data: result.data
      });
    }

  } catch (error) {
    console.error('❌ Chat Controller Error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to process chat request',
      data: {
        query: req.body.query || '',
        intent: 'error',
        result: {},
        evidence: [],
        confidence_score: 0,
        summary: 'An error occurred. Please try again.'
      }
    });
  }
};

/**
 * @desc    Identify pill from uploaded image
 * @route   POST /api/assistant/identify-pill
 * @access  Public
 */
export const identifyPill = async (req, res) => {
  try {
    const { image, query = 'Identify this pill' } = req.body;

    if (!image) {
      return res.status(400).json({
        success: false,
        message: 'Image data is required (base64 encoded)'
      });
    }

    console.log(`\n💊 Pill Identification Request`);

    // Remove data:image/...;base64, prefix if present
    let imageBase64 = image;
    if (image.includes('base64,')) {
      imageBase64 = image.split('base64,')[1];
    }

    // Validate base64
    if (!imageBase64 || imageBase64.length < 100) {
      return res.status(400).json({
        success: false,
        message: 'Invalid image data'
      });
    }

    // Call AI vision model
    const result = await identifyPillFromImage(imageBase64, query);

    if (result.success) {
      return res.status(200).json({
        success: true,
        data: result.data,
        usage: result.usage,
        source: 'openrouter_vision'
      });
    } else {
      return res.status(500).json({
        success: false,
        message: result.error || 'Pill identification failed',
        data: result.data
      });
    }

  } catch (error) {
    console.error('❌ Pill Identification Controller Error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to identify pill',
      data: {
        query: 'pill_id',
        intent: 'pill_id',
        result: {},
        evidence: ['FDA Pillbox: https://pillbox.nlm.nih.gov/'],
        confidence_score: 0,
        summary: 'Unable to process image. Please try again or consult a pharmacist.'
      }
    });
  }
};

/**
 * @desc    Get medical information about a specific medicine
 * @route   GET /api/assistant/medicine/:name
 * @access  Public
 */
export const getMedicineInfo = async (req, res) => {
  try {
    const { name } = req.params;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Medicine name is required'
      });
    }

    const query = `Provide detailed information about ${name} including typical adult uses, major side effects, contraindications, major drug interactions, and 2-3 reputable medical sources.`;

    console.log(`\n💊 Medicine Info Request: ${name}`);

    const result = await queryMedicalAssistant(query);

    if (result.success) {
      return res.status(200).json({
        success: true,
        data: result.data,
        usage: result.usage,
        source: 'openrouter'
      });
    } else {
      return res.status(500).json({
        success: false,
        message: result.error || 'Failed to fetch medicine information'
      });
    }

  } catch (error) {
    console.error('❌ Medicine Info Controller Error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch medicine information'
    });
  }
};

export default {
  chatWithAssistant,
  identifyPill,
  getMedicineInfo
};
