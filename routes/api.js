import { Router } from "express";
import AuthController from "../controllers/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import ProfileController from "../controllers/profileController.js";
import NewsController from "../controllers/newsController.js";

const router = Router();

router.post("/auth/register", AuthController.register);
router.post("/auth/login", AuthController.login);

// * Profile routes
router.get("/profile", authMiddleware, ProfileController.index); // Private route
router.put("/profile/:id", authMiddleware, ProfileController.update); // Private route

// * News routes
router.get("/news", NewsController.index);
router.post("/news", authMiddleware, NewsController.store);
router.get("/news/:id", NewsController.show);
router.put("/news/:id", NewsController.update);
router.delete("/news/:id", NewsController.destroy);

export default router;
