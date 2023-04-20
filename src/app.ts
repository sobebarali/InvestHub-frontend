import express, { Express } from "express";
import connectDB from "./database/database";
import { config } from "./config/config";
import { userRoute } from "./routes/userRoute";

const app: Express = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const PORT: string | undefined = config.PORT;

app.use("/api", userRoute);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
  });
});

export default app;
