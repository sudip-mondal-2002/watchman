export type RequestPayload = {
    timestamp: number;
    responseStatus: number;
    origin: string;
}

export type Ping = {
    lastPingSent?: number;
    lastPingReceived?: number;
    socketID: string;

    timestamps: number[];
    cpuUsage: number[];
    memoryUsage: number[];

    isAlive: boolean;

    requests: RequestPayload[]
}

export type Room = {
    appName: string;
    sockets: Ping[];
}
export const rooms: Room[] = []

export const getPings = () => {
    const pings: Ping[] = [];
    rooms.forEach(room => {
        room.sockets.forEach(socket => {
            pings.push(socket);
        })
    })
    return pings;
}