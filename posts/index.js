const express = require('express');
const bodyParser = require('body-parser');
const { randomBytes } = require('crypto');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {};

app.get("/posts", (req, res) => {
  res.send(Object.values(posts));  // Return an array
});

app.post("/posts",async (req, res) => {
  const id = randomBytes(4).toString('hex');
  const { title } = req.body;
  posts[id] = { id, title };
  await axios.post('http://localhost:4005/events',{
    type:'PostCreated',
    date:{
      id,title
    }
  })
  console.log("New post added:", posts[id]); // Debug log
  res.status(201).send(posts[id]);
});

app.post('/events',(req,res)=>{

  console.log('Received Event',req.body.type);
  res.send({

  });
})

app.listen(4000, () => {
  console.log("Server listening on port 4000");
});
