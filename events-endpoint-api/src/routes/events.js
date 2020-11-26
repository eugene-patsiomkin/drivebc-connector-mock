import express from "express";
const eventRouter = express.Router();

eventRouter.get('/', (req, res) => {
    res.json("aaaaaaaa").status('200');
})


export default eventRouter;