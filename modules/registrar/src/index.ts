import {startServer} from "./connections/StartServer";
import {connectToServer} from "./connections/ConnectToServer";


startServer().listen(3000, () => {
    console.log("Server started on port 3000");
})

process.env.APP_NAME = "test";

connectToServer("http://localhost:3000");
connectToServer("http://localhost:3000");
