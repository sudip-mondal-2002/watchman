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
    server.get("/:socketID", (req, res) => {
        const room = rooms.find(room => room.sockets.find(socket => socket.socketID === req.params.socketID));
        if (!room) {
            return res.status(404).send("Not Found");
        }
        const socket = room.sockets.find(socket => socket.socketID === req.params.socketID);
        if (!socket) {
            return res.status(404).send("Not Found");
        }
        res.render("socket", {
            socket: socket,
        })
    });
    return httpServer
}
