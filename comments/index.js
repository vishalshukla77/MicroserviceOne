const express= require('express');
const bodyParser=require('body-parser')
const { randomBytes } = require('crypto'); 
const cors=require('cors');
const app=express();
app.use(bodyParser.json());
app.use(cors());

const commentByPostId={};

app.get("/posts/:id/comments",(req,res)=>{

    res.send(commentByPostId[req.params.id] || []);


})
app.post("/posts/:id/comments",(req,res)=>{
    const commemtId=randomBytes(4).toString('hex');
    const {content}=req.body;
    
    const comments= commentByPostId[req.params.id] || [];

    comments.push({id:commemtId,content,status:'pending'});
    commentByPostId[req.params.id]=comments;

    axios.post('http://localhost:4005/events',{
        type:'CommentCreated',
        date:{
            id:commemtId,
            content,
            postId:req.params.id,
            status:'pending'


        }
    })


    res.status(201).send({  comments });
    
})

app.post('/events',(req,res)=>{
    console.log('Event Received',req.body.type);

    const {type,data}=req.body;

    if(type=='CommentModerated'){

        const{postId,id,status}=data;
        const comment =commentByPostId[postId];

        const comment =comments.fint(comment=>{
            return comment.id==id;
        });

        comment.status=status;

        await axios.post('https://localhost:4005',{

            type:'CommentUpdated',
            data:{
                id,
                id,
                status,
                postId,
                content
            }
        })

    }
    res.send({});
})

app.listen(4001,()=>{
    console.log("listening on 4001");
})