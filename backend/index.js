import express from 'express';
import { connectDB } from './database/db.js';
import dotenv from 'dotenv';
import cloudinary from 'cloudinary';

dotenv.config();

cloudinary.v2.config({
    cloud_name: process.env.cloudinary_cloud_name,
    api_key: process.env.cloudinary_api,
    api_secret: process.env.cloudinary_secret,
});

const app = express();

//using middleware
app.use(express.json());


// app.get('/', (req, res) => {
//     res.send('Hello World');
// });

const port = process.env.PORT;

//importing routes
import userRoutes from './routes/userRoutes.js';
import authRoutes from './routes/authRoutes.js';
import postRoutes from './routes/postRoutes.js';

//using routes
app.use('/api/user', userRoutes);
app.use('/api/post', postRoutes);
app.use('/api/auth', authRoutes);



app.listen(port, () => {
    connectDB();
    console.log(`Server is running on http://localhost:${port}`);
});