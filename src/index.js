"use strict";
exports.__esModule = true;
var ws_1 = require("ws");
var express_1 = require("express");
var path_1 = require("path");
var chalk_1 = require("chalk");
var app = express_1["default"]();
var PUBLIC_PATH = path_1["default"].join('../', './static');
var PORT = 3000;
var WS_PORT = 3001;
app.use(express_1["default"].static(PUBLIC_PATH));
app.get('/index.js', function (_req, res) {
    res.sendFile('./client.js');
});
// @ts-ignore
var ws = new ws_1["default"].Server({
    port: WS_PORT
});
app.listen(PORT, function () {
    console.log(chalk_1["default"].green("App successfully started on PORT " + PORT));
});
