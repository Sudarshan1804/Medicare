import express from 'express';
import { 
  chatWithAssistant, 
  identifyPill,
  getMedicineInfo 
} from '../controllers/assistantController.js';
import { queryMedicalAssistant } from '../services/aiAssistantService.js';

const router = express.Router();

// @route   GET /api/assistant/health
// @desc    Check AI assistant health and connectivity
// @access  Public
router.get('/health', async (req, res) => {
  try {
    console.log('\n🏥 AI Assistant Health Check');
    
    // Test with a simple medical query
    const result = await queryMedicalAssistant('What is aspirin?');
    
    if (result.success) {
      return res.status(200).json({
        success: true,
        status: 'healthy',
        message: 'AI Assistant is working properly',
        model: 'llama-3.3-70b-versatile',
        provider: 'GroqCloud',
        testQuery: 'What is aspirin?',
        testResult: result.data.intent
      });
    } else {
      return res.status(503).json({
        success: false,
        status: 'unhealthy',
        message: 'AI Assistant is not responding properly',
        error: result.error
      });
    }
  } catch (error) {
    console.error('❌ Health check failed:', error);
    return res.status(503).json({
      success: false,
      status: 'error',
      message: 'AI Assistant health check failed',
      error: error.message
    });
  }
});

// @route   POST /api/assistant/chat
// @desc    Chat with AI medical assistant
// @access  Public
router.post('/chat', chatWithAssistant);

// @route   POST /api/assistant/identify-pill
// @desc    Identify pill from uploaded image
// @access  Public
router.post('/identify-pill', identifyPill);

// @route   GET /api/assistant/medicine/:name
// @desc    Get detailed information about a specific medicine
// @access  Public
router.get('/medicine/:name', getMedicineInfo);

export default router;
