import {NextFunction, Request, Response} from "express";
import {client} from "../data/client";
import {Events} from "../meta/Events";
import {RequestReceived} from "../meta/RequestReceived";

export const requestMonitor = (req: Request, res: Response, next: NextFunction) => {
    const payload: RequestReceived = {
        origin: req.headers.origin || req.headers.host || "unknown",
        socketID: client.socket?.id || "unknown",
        responseStatus: res.statusCode
    }
    client.socket?.emit(Events.REQUEST, payload)
    next();
}