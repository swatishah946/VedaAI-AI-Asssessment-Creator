import { generateAssessmentStructure } from '../services/aiService';

const runTest = async () => {
  console.log('Testing Gemini API integration...');
  try {
    const result = await generateAssessmentStructure(
      'Grade 8 Science - Chemical Effects of Electric Current',
      'Moderate',
      5
    );
    
    console.log('\n--- SUCCESS! Raw JSON Output ---\n');
    console.log(JSON.stringify(result, null, 2));
    
  } catch (error) {
    console.error('Test failed:', error);
  }
};

runTest();
