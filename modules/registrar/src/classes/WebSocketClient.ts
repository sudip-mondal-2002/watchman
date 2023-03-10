import {io, Socket} from "socket.io-client"
import {HeartBeatPing} from "../meta/Heartbeat";
import {Events} from "../meta/Events";
import os from "os";
import {client} from "../data/client";

export class WebSocketClient {
    constructor(url:string="http://localhost:3000") {
        if(!process.env.APP_NAME){
            throw new Error("APP_NAME not set in environment variables");
        }
        client.socket = io(url, {
            auth: {
                appName: process.env.APP_NAME
            }
        });
        client.socket.on(Events.HEARTBEAT_PING, this.onHeartbeat);
    }
    onHeartbeat = (payload: HeartBeatPing) => {
        const totalCPU = os.cpus().map(cpu => Object.values(cpu.times).reduce((a, b) => a + b, 0)).reduce((a, b) => a + b, 0);
        const cpuUsage = 1 - os.cpus().map(cpu => cpu.times.idle).reduce((a, b) => a + b, 0) / totalCPU;
        const response = {
            pingTimestamp: payload.timestamp,
            timestamp: Date.now(),
            cpuUsage: cpuUsage*100,
            memoryUsage: (1- os.freemem()/os.totalmem())*100,
            socketID: client.socket?.id
        }
        client.socket?.emit(Events.HEARTBEAT_ACK, response);
    }
}