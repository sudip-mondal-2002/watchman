import {HeartBeatAck, HeartBeatPing} from "../meta/Heartbeat";
import {Events} from "../meta/Events";
import {Server} from "http";
import {rooms, getPings, RequestPayload} from "../data/Rooms";
import {RequestReceived} from "../meta/RequestReceived";

const socket = require('socket.io')
export class WebSocketServer {
    private io;
    private interval = 1000;
    private maxDelay = 2000;
    constructor(server: Server) {
        this.io = socket(server);
        this.io.on("connection", this.onConnection);
        this.checkHeartbeat();
    }

    onConnection = (socket: any) => {
        if (!socket.handshake.auth.appName) {
            socket.join("monitor");
        }
        const appName = socket.handshake.auth.appName;
        const room = rooms.find(room => room.appName === appName);
        if (!room) {
            rooms.push({
                appName,
                sockets: [{
                    socketID: socket.id,
                    isAlive: true,
                    requests: [],
                    cpuUsage: [],
                    memoryUsage: [],
                    timestamps: []
                }]
            })
        } else {
            room.sockets.push({
                socketID: socket.id,
                isAlive: true,
                requests: [],
                cpuUsage: [],
                memoryUsage: [],
                timestamps: []
            })
        }
        this.sendHeartbeat(socket.id);
        socket.on(Events.HEARTBEAT_ACK, this.onHeartbeat)
        socket.on("disconnect", this.onDisconnect);
        socket.on(Events.REQUEST, this.onRequest);
    }

    onDisconnect = (socketID: string) => {
        rooms.forEach(room => {
            room.sockets = room.sockets.filter(socket => socket.socketID !== socketID);
        })
        rooms.filter(room => room.sockets.length === 0);
    }
    sendHeartbeat = (socketID: string) => {
        setInterval(() => {
            const payload: HeartBeatPing = {
                timestamp: Date.now()
            }
            this.io.to(socketID).emit(Events.HEARTBEAT_PING, payload);
            const pings = getPings();
            pings.forEach((ping, index) => {
                if (ping.socketID === socketID) {
                    pings[index].lastPingSent = payload.timestamp;
                }
            })
        }, this.interval);
    }

    onHeartbeat = (payload: HeartBeatAck) => {
        const pings = getPings();
        pings.forEach((ping, index) => {
            if (ping.socketID === payload.socketID) {
                pings[index].lastPingReceived = payload.timestamp;
                pings[index].cpuUsage.push(Math.floor(payload.cpuUsage*100)/100);
                pings[index].memoryUsage.push(Math.floor(payload.memoryUsage*100)/100);
                pings[index].timestamps.push(payload.timestamp);
                pings[index].isAlive = true;
            }
        });
    }

    checkHeartbeat = () => {
        setInterval(() => {
            const pings = getPings();
            pings.forEach((ping, index) => {
                if (ping.lastPingSent && ping.lastPingReceived) {
                    if (ping.lastPingSent - ping.lastPingReceived > this.maxDelay) {
                        pings[index].isAlive = false;
                    }
                }
            })
        }, this.interval);
    }
    onRequest = (payload: RequestReceived) => {
        const room = rooms.find(room => room.sockets.find(socket => socket.socketID === payload.socketID));
        if (!room) { return; }
        const ping = room.sockets.find(socket => socket.socketID === payload.socketID);
        if (!ping) { return; }
        const request: RequestPayload = {
            origin: payload.origin,
            responseStatus: payload.responseStatus,
            timestamp: Date.now()
        }
        ping.requests.push(request);
    }
}