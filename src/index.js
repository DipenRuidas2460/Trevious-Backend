const express = require('express');
const route = require('./routes/route.js');
const { default: mongoose } = require('mongoose');
const app = express();

const multer = require("multer");

app.use(express.json());
app.use(multer().any())

mongoose.connect("mongodb+srv://Dipen1234:RXfYujdeg6KuTGfm@cluster0.dkmbl.mongodb.net/Trevious-ECom"
    , {
        useNewUrlParser: true
    })
    .then(() => console.log("MongoDb is connected"))
    .catch(err => console.log(err))

mongoose.set('strictQuery', true);

app.use('/', route);

app.use((req, res, next) => {
    res.status(404).send({ status: false, msg: `Not found ${req.url}` })
    next()
})


app.listen(process.env.PORT || 3002, function () {
    console.log('Express app running on port ' + (process.env.PORT || 3002))
});