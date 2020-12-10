import express from "express";
import bodyParser from "body-parser";
import morgan from 'morgan';
import proxy from 'express-http-proxy';
import {connectDB} from './src/db.js';
import Routes from "./src/routes/index.js";
import {swaggerDocument, swaggerUi} from './openapi/index.js'
import {bodyParserErrorHandler} from "./src/app.js"


const app = express();
const config = {
    name: "images api",
    port: process.env.MOTI_API_PROFILES_PORT || 7763,
    host: '0.0.0.0',
};

app.use(morgan(':method :url :status [:res[content-type]] :res[content-length] bytes - :response-time ms'));
// Swagger setup
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

//images proxy
let imageServer = "https://images.drivebc.ca";
app.get(/\/images.*/i, proxy(imageServer, {
    proxyReqPathResolver: function (req) {
        let prefix = "/webcam/api/v1/webcams/";
        let postfix = "/imageSource";
        console.log(req.url);
        let parts = req.url.split('?');
        let queryString = parts[1];
        console.log(parts[0]);

        let updatedPath = parts[0].replace(/.*\/camera\/(\d*)\/.*/i, `${prefix}$1${postfix}`);
        console.log(updatedPath);
        
        return updatedPath + (queryString ? '?' + queryString : '');
      }    
}));

//Accept json
app.use(bodyParser.json({type: 'application/*+json'}));
app.use(bodyParser.json({type: 'application/json'}));
app.use(bodyParserErrorHandler);

// Health check endpoint
app.get('/ping', (req, res) => {
    res.status(200).json("pong");
});

Routes.forEach((route) => {
    app.use(route.path, route.route);
});

connectDB().then( async () => {
    app.listen(config.port, config.host, (e)=> {
        if(e) {
            throw new Error(e);
        }
        console.log(`${config.name} is running on port ${config.port}`);
    });
});