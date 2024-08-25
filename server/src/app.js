import express from "express";
import authRouter from "./routes/auth.routes.js"
import bodyParser from "body-parser";
import cors from "cors";

const app = express();

app.use(
    cors({
      origin: "http://localhost:5173",
      credentials: true,
      exposedHeaders: ["Set-Cookie"],
    })
  );

app.use(bodyParser.json());

app.get("/", (req,res)=>{
    res.send("Hello world");
})

app.use("/api/v1/auth", authRouter);

export {app};