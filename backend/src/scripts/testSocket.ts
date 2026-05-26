
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000');

socket.on('connect', () => {
  console.log(`Connected to server with ID: ${socket.id}`);
  
  // We need to trigger a job first to get an assessmentId, 
  // but for testing, we can just listen broadly or join a dummy room.
  // Actually, we'll hit the API to generate a new assessment, get the ID, and join the room.
  
  fetch('http://localhost:5000/api/assessments/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      topic: 'Geography: The Solar System',
      questionsCount: 2,
      difficulty: 'Easy'
    })
  })
  .then(res => res.json())
  .then(data => {
    console.log('Triggered generation:', data);
    const assessmentId = data.assessmentId;
    
    // Join the room
    socket.emit('join_assessment_room', assessmentId);
    console.log(`Waiting for completion event in room ${assessmentId}...`);
  })
  .catch(err => console.error(err));
});

socket.on('assessment_completed', (data) => {
  console.log('\n--- RECEIVED REAL-TIME EVENT: assessment_completed ---');
  console.log(JSON.stringify(data, null, 2));
});

socket.on('assessment_failed', (data) => {
  console.error('Generation failed!', data);
});
