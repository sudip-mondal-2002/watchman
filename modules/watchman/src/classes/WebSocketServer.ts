import {HeartBeatAck, HeartBeatPing} from "../meta/Heartbeat";

const socket = require('socket.io')
import {Events} from "../meta/Events";
import {Server} from "http";
import {rooms, getPings} from "../data/Rooms";
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
                    isAlive: true
                }]
            })
        } else {
            room.sockets.push({
                socketID: socket.id,
                isAlive: true
            })
        }
        this.sendHeartbeat(socket.id);
        socket.on(Events.HEARTBEAT_ACK, this.onHeartbeat)
        socket.on("disconnect", this.onDisconnect);
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
                pings[index].cpuUsage = Math.floor(payload.cpuUsage*100)/100;
                pings[index].memoryUsage = Math.floor(payload.memoryUsage*100)/100;
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
}