const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios'); // Add axios import

const app = express();
app.use(bodyParser.json());
app.use(cors());

// In-memory data store
const posts = {};

// Event handler function
const handleEvent = (type, data) => {
  if (type === 'PostCreated') {
    const { id, title } = data;
    posts[id] = { id, title, comments: [] };
  }
};

// GET all posts with comments
app.get('/posts', (req, res) => {
  res.send(posts);
});

// Handle events from the Event Bus
app.post('/events', (req, res) => {
  const { type, data } = req.body;
  handleEvent(type, data);
  res.send({ status: 'OK' }); // Always respond
});

// Start the server
app.listen(4002, async () => {  // Mark as async
  console.log("Listening on 4002");

  try {
    const res = await axios.get('http://localhost:4005/events');

    for (let event of res.data) {
      console.log('Processing Event', event.type);
      handleEvent(event.type, event.data); // Correct usage
    }
  } catch (error) {
    console.error('Error fetching events from Event Bus:', error.message);
  }
});
