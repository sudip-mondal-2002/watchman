export type HeartBeatPing = {
    timestamp: number;
}

export type HeartBeatAck = {
    pingTimestamp: number;
    timestamp: number;
    socketID: string;

    cpuUsage: number;
    memoryUsage: number;
}