import express from "express";
import cors from "cors";
import kcseRoutes from "./routes/kcse.routes";

const app = express();

// ✅ MUST be before routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: "*",
  })
);

app.use("/api", kcseRoutes);

export default app;
