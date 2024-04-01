import express from 'express';
import userRoutes from "./routes/userRoutes";
import tweetRoutes from "./routes/tweetRoutes";
import authRoutes from "./routes/authRoutes";
import {verifyToken} from "./middlewares/tokenVerification"
const app = express();

//! End points
app.use(express.json());
app.use("/user", verifyToken, userRoutes);
app.use("/tweet", verifyToken, tweetRoutes);
app.use("/auth", authRoutes);


//! Server
app.listen(5000, () => {
    console.log("Server is listening on port 5000...");
})

