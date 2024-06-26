import dotenv from "dotenv";
import expr from "express";
import connectDb from "./helper/index.js";
import cors from 'cors';
const app = expr();
dotenv.config({
  path: "./.env",
});

app.use(expr.json());

app.use(cors({
  origin: true,
  credentials: true
}));

connectDb()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => console.log("Exceute Connection error", err));