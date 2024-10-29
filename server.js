import express, { urlencoded } from "express";
import "dotenv/config";
import ApiRoutes from "./routes/api.js";
import fileUpload from "express-fileupload";
import helmet from "helmet";
import cors from "cors";
import { limiter } from "./config/rateLimiter.js";

const app = express();

const PORT = process.env.PORT || 8000;

// * Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));
app.use(fileUpload());
app.use(helmet());
app.use(cors());
app.use(limiter);
// * Import routes
app.use("/api", ApiRoutes);

app.get("/", (req, res) => {
  return res.json({ message: "Hello Rajesh! Backend is working..." });
});

app.listen(PORT, () => console.log(`Server is running on ${PORT}.`));
