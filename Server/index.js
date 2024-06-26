import dotenv from "dotenv";
import expr from "express";
import connectDb from "./helper/index.js";

const app = expr();
dotenv.config({
      path: "./.env",
    });
    
connectDb()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => console.log("Exceute Connection error", err));