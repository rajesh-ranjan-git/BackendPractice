import { Router } from "express";
import AuthController from "../controllers/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import ProfileController from "../controllers/profileController.js";
import NewsController from "../controllers/newsController.js";
import { redisCache } from "../DB/redis.config.js";

const router = Router();

router.post("/auth/register", AuthController.register);
router.post("/auth/login", AuthController.login);

// * Profile routes
router.get("/profile", authMiddleware, ProfileController.index); // Private route
router.put("/profile/:id", authMiddleware, ProfileController.update); // Private route

// * News routes
router.get("/news", redisCache.route(), NewsController.index);
router.post("/news", authMiddleware, NewsController.store);
router.get("/news/:id", NewsController.show);
router.put("/news/:id", authMiddleware, NewsController.update);
router.delete("/news/:id", authMiddleware, NewsController.destroy);

export default router;
