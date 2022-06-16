const express = require("express");
const app = express();
const router = express.Router();

const path = __dirname + "/src/";
const port = 8090;

router.get("/", function (req, res) {
    res.sendFile(path + "index.html");
});

app.use(express.static(path));
app.use("/", router);

app.listen(port, function () {
    console.log("App listening on port " + port);
});
