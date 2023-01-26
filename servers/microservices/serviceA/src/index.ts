import {NextFunction, Request, Response} from "express";
import {connectToServer, requestMonitor} from "@sudipmondal/watchman";
import axios from "axios";

const express = require("express");
require('dotenv').config();

const app = express();

app.use(requestMonitor);

app.get("/", (req: Request, res: Response) => {
    res.send("Hello World! This is service A");
});

app.get('/hit-b', async (req: Request, res: Response) => {
    if (process.env.SERVICE_B_URL) {
        const result = await axios.post(process.env.SERVICE_B_URL)
        res.send(result.data);
    } else {
        res.status(503).send("Service B URL not found");
    }
})

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    res.status(500).send('Something broke!');
    next();
})

connectToServer(process.env.WATCHMAN_URL!)

app.listen(process.env.PORT, () => {
    console.log(`Server started on port ${process.env.PORT}`);
});