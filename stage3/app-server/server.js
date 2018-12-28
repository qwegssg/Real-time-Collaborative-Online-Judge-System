const express = require("express");
const app = express();
const port = 3000;
const restRouter = require("./routes/rest");
const indexRouter = require("./routes/index");
const mongoose = require("mongoose");
const path = require("path");

mongoose.connect('mongodb://user:user01@ds113749.mlab.com:13749/online-oj-system', { useNewUrlParser: true });

app.use(express.static(path.join(__dirname, '../public')));
app.use('/', indexRouter);
app.use("/api/v1", restRouter);

app.use((req, res) => {
    res.sendFile("index.html", { root: path.join(__dirname, '../public') });
});

app.listen(port, () => console.log(`App is listening on port ${port}!`));