const express = require("express");
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));

const router = require("./routes");

app.use(router);

app.listen(process.env.PORT || 5000, ()=> {
    console.log("server started")
})