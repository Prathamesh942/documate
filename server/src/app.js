import express from "express";
import authRouter from "./routes/auth.routes.js"
import bodyParser from "body-parser";

const app = express();

app.use(bodyParser.json());

app.get("/", (req,res)=>{
    res.send("Hello world");
})

app.use("/api/v1/auth", authRouter);

export {app};