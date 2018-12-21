const express = require("express");
const app = express();
const restRouter = require("./routes/rest");
const mongoose = require("mongoose");

mongoose.connect("mongodb://user:user01@ds113749.mlab.com:13749/online-oj-system");

app.use("/api/v1", restRouter);

app.listen(3000, () => console.log("App is listening on port 3000!"))