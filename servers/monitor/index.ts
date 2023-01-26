import {startServer} from '@sudipmondal/watchman';

const server = startServer()


server.listen(3000, () => {
    console.log('Server started on port 3000');
});