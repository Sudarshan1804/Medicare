/**
 * Test script to verify AI Assistant and GroqCloud API connectivity
 * Run this with: node test-ai-assistant.js
 */

import fetch from 'node-fetch';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

console.log('🧪 Testing GroqCloud AI Assistant...\n');
console.log('API Key:', GROQ_API_KEY.substring(0, 10) + '...' + GROQ_API_KEY.substring(GROQ_API_KEY.length - 4));
console.log('API URL:', GROQ_API_URL);
console.log('\n' + '='.repeat(60) + '\n');

async function testAIAssistant() {
  try {
    console.log('📤 Sending test query: "What is aspirin used for?"\n');

    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful medical assistant. Provide accurate medical information.'
          },
          {
            role: 'user',
            content: 'What is aspirin used for? Keep it brief.'
          }
        ],
        max_tokens: 200,
        temperature: 0.3
      })
    });

    console.log('📡 Response Status:', response.status, response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('\n❌ ERROR:', errorText);
      
      if (response.status === 401) {
        console.error('\n⚠️  Invalid API key! Please check your GroqCloud API key.');
      } else if (response.status === 429) {
        console.error('\n⚠️  Rate limit exceeded. Please try again in a few moments.');
      }
      
      process.exit(1);
    }

    const data = await response.json();
    
    console.log('\n✅ SUCCESS! AI Assistant is working!\n');
    console.log('='.repeat(60));
    console.log('Model:', data.model);
    console.log('Response:');
    console.log('='.repeat(60));
    console.log(data.choices[0].message.content);
    console.log('='.repeat(60));
    console.log('\nTokens used:', data.usage?.total_tokens || 'N/A');
    console.log('\n✅ AI Assistant test PASSED!\n');
    
    // Test the health endpoint
    console.log('\n📡 Testing health endpoint...');
    const healthResponse = await fetch('http://localhost:5000/api/assistant/health');
    const healthData = await healthResponse.json();
    
    console.log('Health check result:', healthData.status);
    console.log('Response:', JSON.stringify(healthData, null, 2));

  } catch (error) {
    console.error('\n❌ Test FAILED!');
    console.error('Error:', error.message);
    console.error('\nStack trace:');
    console.error(error.stack);
    process.exit(1);
  }
}

testAIAssistant();
