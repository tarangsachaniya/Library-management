import dotenv from "dotenv";
import expr from "express";
import connectDb from "./helper/index.js";
import cors from 'cors';
import userRouter from './routes/userRouter.js';
import cookieParser from "cookie-parser";
const app = expr();
dotenv.config({
  path: "./.env",
});

app.use(expr.json());

app.use(cors({
  origin: true,
  credentials: true
}));
app.use(cookieParser());
connectDb()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => console.log("Exceute Connection error", err));
app.use('/api/user' , userRouter);