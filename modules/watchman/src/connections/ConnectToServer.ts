import {WebSocketClient} from "../classes/WebSocketClient";

export const connectToServer = (url: string) => {
    return new WebSocketClient(url);
}