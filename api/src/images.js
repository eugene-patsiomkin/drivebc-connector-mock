var express = require('express')
var router = express.Router()

const images = {
    1: {
        "name" : "Image 1",
        "description":  "Image 1",
        "url": "//host/path/images/1.jpg"
    },
    2: {
        "name" : "Image 2",
        "description":  "Image 2",
        "url": "//host/path/images/2.jpg"
    },
    3: {
        "name" : "Image 3",
        "description":  "Image 3",
        "url": "//host/path/images/3.jpg"
    }
}

let currentId = 3

// middleware that is specific to this router
router.use(function timeLog (req, res, next) {
  console.log(Date.now(), `[${req.method}] ${req.originalUrl}`)
  next()
})
// define the home page route
router.get('/', function (req, res) {
  res.status(200).json(images);
})
// define the about route
router.get('/:imageId(\\d+)', function (req, res) {
  let imageId = req.params.imageId;

  if (images[imageId]) {
    res.status(200).json(images[imageId]);
  } else {
      res.status(400).json({error: "Not found"});
  }
})

router.options('/', function(req, res) {
    res.status(200).json("Lots of options");
});

module.exports = router