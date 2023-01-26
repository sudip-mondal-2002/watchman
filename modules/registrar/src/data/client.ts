import {Socket} from "socket.io-client";

export const client:{
    socket: Socket | undefined;
} = {
    socket: undefined
}