import express from 'express';
import cors from 'cors'
import mongoose from 'mongoose'

import {
    userRouter
} from './routes/users.js'

const app = express();

app.use(express.json());
app.use(cors());
app.use("/auth", userRouter);

mongoose.connect(
    "mongodb+srv://dmcgregor:7HJJxy9FZBZGKMBr@cluster0.outhpbb.mongodb.net/pinecone?retryWrites=true&w=majority"
);

const port = 4001;
app.listen({
    port
}, () => console.log(`Server running on port ${port}`));