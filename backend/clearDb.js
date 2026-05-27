const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb://localhost:27017/vedaai';

async function clearDb() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected.');
    
    console.log('Dropping the assessments collection...');
    await mongoose.connection.db.dropCollection('assessments');
    console.log('Old assessments cleared successfully.');
  } catch (error) {
    if (error.code === 26) {
      console.log('Collection already empty or does not exist.');
    } else {
      console.error('Error clearing DB:', error);
    }
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
  }
}

clearDb();
