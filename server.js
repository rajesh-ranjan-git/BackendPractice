import express, { urlencoded } from "express";
import "dotenv/config";
import fileUpload from "express-fileupload";

const app = express();

const PORT = process.env.PORT || 8000;

// * Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(fileUpload());

app.get("/", (req, res) => {
  return res.json({ message: "Hello Rajesh! Backend is working..." });
});

// * Import routes
import ApiRoutes from "./routes/api.js";
app.use("/api", ApiRoutes);

app.listen(PORT, () => console.log(`Server is running on ${PORT}.`));
