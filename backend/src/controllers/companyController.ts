import { Request, Response } from "express";
import Company from "../models/companyModel";
import User from "../models/userModel";
import {
  createSnsTopic,
  sns,
  subscribeToSnsTopic,
} from "../utils/notification";

class CompanyController {
  public static async createCompany(req: Request, res: Response): Promise<any> {
    try {
      const userId = (req as any).userId;
      let { name, description } = req.body;

      if (!name) {
        return res
          .status(400)
          .json({ message: "Please provide a company name." });
      }

      name = name.replace(/\s/g, "");

      const company = new Company({ name, description, shareholder: userId });
      const snsTopicArn = await createSnsTopic(name);
      company.snsTopicArn = snsTopicArn;
      await company.save();

      res.status(201).json(company);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  }

  public static async updateCompany(req: Request, res: Response): Promise<any> {
    try {
      const companyId = req.params.id;
      const userId = (req as any).userId;
      const { name, description } = req.body;

      const company = await Company.findOne({
        _id: companyId,
        shareholder: userId,
      });

      if (!company) {
        return res.status(404).json({ message: "Company not found." });
      }

      if (name) {
        company.name = name;
      }
      if (description) {
        company.description = description;
      }

      await company.save();

      res.status(200).json(company);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  }

  public static async getCompanies(req: Request, res: Response): Promise<any> {
    try {
      const companies = await Company.find();
      res.status(200).json(companies);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  }

  public static async addToWatchlist(
    req: Request,
    res: Response
  ): Promise<any> {
    const userId = (req as any).userId;
    const companyId = req.params.id;

    try {
      const company = await Company.findById(companyId);

      if (!company) {
        return res.status(404).json({ message: "Company not found" });
      }

      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (!user.watchlist.some((item) => item._id.equals(company._id))) {
        user.watchlist.push(company);
        await user.save();
      }

      const subscriptions = await sns
        .listSubscriptionsByTopic({ TopicArn: company.snsTopicArn })
        .promise();
      const isSubscribed = subscriptions?.Subscriptions?.some(
        (item) => item.Endpoint === user.email
      );
      if (!isSubscribed) {
        await subscribeToSnsTopic(company.snsTopicArn, "email", user.email);
      }

      res.status(200).json({ message: "Company added to watchlist" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  public static async removeFromWatchlist(
    req: Request,
    res: Response
  ): Promise<any> {
    const userId = (req as any).userId;
    const companyId = req.params.id;

    try {
      const user = await User.findById(userId);

      // Check if the user exists
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Remove the company from the user's watchlist
      user.watchlist = user.watchlist.filter(
        (item) => !item._id.equals(companyId)
      );
      await user.save();

      res.status(200).json({ message: "Company removed from watchlist" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  public static async addCompanyUpdate(
    req: Request,
    res: Response
  ): Promise<any> {
    try {
      const companyId = req.params.id;
      const userId = (req as any).userId;
      const { content } = req.body;

      if (!content) {
        return res
          .status(400)
          .json({ message: "Please provide update content." });
      }

      const company = await Company.findOne({
        _id: companyId,
        shareholder: userId,
      });

      if (!company) {
        return res.status(404).json({ message: "Company not found." });
      }

      company.updates.push({ content, date: new Date() });

      const params = {
        TopicArn: company.snsTopicArn,
        Message: content,
      };
      await sns.publish(params).promise();

      await company.save();

      res.status(201).json({ message: "Update added." });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  }

  public static async getCompanyUpdates(
    req: Request,
    res: Response
  ): Promise<any> {
    try {
      const companyId = req.params.id;

      const company = await Company.findById(companyId);

      if (!company) {
        return res.status(404).json({ message: "Company not found." });
      }

      res.status(200).json(company.updates);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  }
}

export default CompanyController;
