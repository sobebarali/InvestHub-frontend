"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const database_1 = __importDefault(require("./database/database"));
const config_1 = require("./config/config");
const userRoute_1 = require("./routes/userRoute");
const companyRoute_1 = require("./routes/companyRoute");
const cors = require("cors");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
const PORT = config_1.config.PORT;
app.use(cors());
app.use("/api", userRoute_1.userRoute);
app.use("/api", companyRoute_1.companyRoute);
(0, database_1.default)().then(() => {
    app.listen(PORT, () => {
        console.log(`Server started on port ${PORT}`);
    });
});
exports.default = app;
