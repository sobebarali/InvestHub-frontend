import express from "express";
import CompanyController from "../controllers/companyController";
import { requireRole } from "../middleware/checkRole";

const companyRoute = express.Router();

companyRoute.post(
  "/companies",
  requireRole("shareholder"),
  CompanyController.createCompany
);
companyRoute.put(
  "/companies/:id",
  requireRole("shareholder"),
  CompanyController.updateCompany
);
companyRoute.get("/companies", CompanyController.getCompanies); // Updated route
companyRoute.post(
  "/companies/:id/watchlist",
  requireRole("investor"),
  CompanyController.addToWatchlist
);
companyRoute.delete(
  "/companies/:id/watchlist",
  requireRole("investor"),
  CompanyController.removeFromWatchlist
);
companyRoute.post(
  "/companies/:id/updates",
  requireRole("shareholder"),
  CompanyController.addCompanyUpdate
);
companyRoute.get("/companies/:id/updates", CompanyController.getCompanyUpdates);

export { companyRoute };
