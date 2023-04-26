"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.companyRoute = void 0;
const express_1 = __importDefault(require("express"));
const companyController_1 = __importDefault(require("../controllers/companyController"));
const checkRole_1 = require("../middleware/checkRole");
const companyRoute = express_1.default.Router();
exports.companyRoute = companyRoute;
companyRoute.post("/companies", (0, checkRole_1.requireRole)("shareholder"), companyController_1.default.createCompany);
companyRoute.put("/companies/:id", (0, checkRole_1.requireRole)("shareholder"), companyController_1.default.updateCompany);
companyRoute.get("/companies", companyController_1.default.getCompanies); // Updated route
companyRoute.post("/companies/:id/watchlist", (0, checkRole_1.requireRole)("investor"), companyController_1.default.addToWatchlist);
companyRoute.delete("/companies/:id/watchlist", (0, checkRole_1.requireRole)("investor"), companyController_1.default.removeFromWatchlist);
companyRoute.post("/companies/:id/updates", (0, checkRole_1.requireRole)("shareholder"), companyController_1.default.addCompanyUpdate);
companyRoute.get("/companies/:id/updates", companyController_1.default.getCompanyUpdates);
