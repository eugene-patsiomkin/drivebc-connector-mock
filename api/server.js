const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const imagesRouter = require('./src/images');

const config = {
    name: 'sample-express-app',
    port: 8300,
    host: '0.0.0.0',
};

const app = express();
const r = express.Router();



app.use(bodyParser.json());
app.use(cors());
app.use("/images", imagesRouter);

app.get('/ping', (req, res) => {
    res.status(200).json("pong");
});

app.listen(config.port, config.host, (e)=> {
    if(e) {
        throw new Error(e);
    }
});