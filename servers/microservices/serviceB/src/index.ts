import  {Request, Response, NextFunction} from "express";
const express = require("express");
import  {connectToServer, requestMonitor} from "@sudipmondal/watchman";
require('dotenv').config();

const app = express();

app.get("/", (req: Request, res: Response) => {
    res.send("Hello World! This is service B");
});

app.post("/", (req:Request, res:Response) => {
    res.json({"message": "You posted to service B"});
})

app.post('/throw', (req:Request, res:Response) => {
    throw new Error("This is an error");
})

app.use((err: Error, req: Request, res: Response, next:NextFunction) => {
    res.status(500).send('Something broke!');
    next();
})

app.use(requestMonitor);

connectToServer(process.env.WATCHMAN_URL!)
app.listen(process.env.PORT, () => {
    console.log(`Server started on port ${process.env.PORT}`);
})

