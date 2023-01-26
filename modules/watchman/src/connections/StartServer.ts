import express from "express";
import http from "http";
import {WebSocketServer} from "../classes/WebSocketServer";
import {rooms} from "../data/Rooms";

export const startServer = () => {
    const server = express();
    server.set('view engine', 'ejs');
    const httpServer = http.createServer(server);
    const ws = new WebSocketServer(httpServer);
    server.set('views', "node_modules/@sudipmondal/watchman/views");
    server.get("/", (req, res) => {
        res.render("monitor", {
            rooms: rooms
        });
    });
    return httpServer
}
