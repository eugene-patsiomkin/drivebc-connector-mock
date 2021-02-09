import express from "express";
import path from "path";
import bodyParser from "body-parser";
import morgan from 'morgan';
import http from 'http';
import {Server as ServerIo} from 'socket.io';
import {ZipkinTracerMiddleware} from "./src/zipkin.js"

const app = express();
const httpServer = http.Server(app); 
const io = new ServerIo(
    httpServer
);

//app.use(ZipkinTracerMiddleware);

const config = {
    name: "event push",
    port:  process.env.MOTI_EVENTS_PUSH_HTTP_PORT || 8123,
    host: '0.0.0.0',
};

const dirname = path.resolve("src")


//Setting up logger
app.use(morgan('common'));

//Accept json
app.use(bodyParser.json({type: 'application/*+json'}));
app.use(bodyParser.json({type: 'application/json'}));

// Health check endpoint
app.get('/ping', (req, res) => {
    res.status(200).json("pong");
});

app.get('/eventList', (req, res) => {
    res.status(200).sendFile(dirname+"/html/index.html");
});

app.post('/event', (req, res) => {
    io.emit('event_created', req.body);
    res.json("Done").status(200);
})


io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});


httpServer.listen(config.port, config.host, (e)=> {
    if(e) {throw new Error(e);}
    console.log(`${config.name} is running on port ${config.port}`);
});