import vine, { errors } from "@vinejs/vine";
import {
  generateRandomNumber,
  imageValidator,
  removeImage,
  uploadImage,
} from "../utils/helper.js";
import prisma from "../DB/db.config.js";
import { newsSchema } from "../validations/newsValidation.js";
import NewsApiTransform from "../transform/newsApiTransform.js";

class NewsController {
  static async index(req, res) {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 1;

      if (page <= 0) {
        page = 1;
      }

      if (limit <= 0 || limit > 100) {
        limit = 10;
      }

      const skip = (page - 1) * limit;

      const news = await prisma.news.findMany({
        take: limit,
        skip: skip,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              profile: true,
            },
          },
        },
      });

      const newsTransform = news?.map((item) =>
        NewsApiTransform.transform(item)
      );

      const totalNews = await prisma.news.count();
      const totalPages = Math.ceil(totalNews / limit);

      return res.json({
        status: 200,
        news: newsTransform,
        metadata: {
          totalPages,
          currentPage: page,
          currentLimit: limit,
        },
      });
    } catch (error) {
      console.log("The error is : ", error);
      if (error instanceof errors.E_VALIDATION_ERROR) {
        return res.status(400).json({ errors: error.messages });
      } else {
        return res.status(500).json({
          status: 500,
          message: "Something went wrong. Please try again.",
        });
      }
    }
  }

  static async store(req, res) {
    try {
      const user = req.user;
      const body = req.body;
      const validator = vine.compile(newsSchema);
      const payload = await validator.validate(body);

      // return res.status(200).json({ payload });

      if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
          errors: {
            image: "Image field is required.",
          },
        });
      }

      const image = req.files?.image;
      // * Image custom validator
      const message = imageValidator(image?.size, image?.mimetype);
      if (message !== null) {
        return res.status(400).json({
          errors: {
            image: message,
          },
        });
      }

      // * Image upload
      const imageName = uploadImage(image);

      payload.image = imageName;
      payload.user_id = user.id;

      const news = await prisma.news.create({
        data: payload,
      });

      return res.json({
        status: 200,
        message: "News created successfully.",
        news,
      });
    } catch (error) {
      console.log("The error is : ", error);
      if (error instanceof errors.E_VALIDATION_ERROR) {
        return res.status(400).json({ errors: error.messages });
      } else {
        return res.status(500).json({
          status: 500,
          message: "Something went wrong. Please try again.",
        });
      }
    }
  }

  static async show(req, res) {
    try {
      const { id } = req.params;
      const news = await prisma.news.findUnique({
        where: {
          id: Number(id),
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              profile: true,
            },
          },
        },
      });

      const newsTransform = news ? NewsApiTransform.transform(news) : null;

      return res.json({
        status: 200,
        news: newsTransform,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Something went wrong. Please try again." });
    }
  }

  static async update(req, res) {
    try {
      const { id } = req.params;
      const user = req.user;
      const body = req.body;

      const news = await prisma.news.findUnique({
        where: {
          id: Number(id),
        },
      });

      if (user.id !== news.user_id) {
        return res.status(401).json({ message: "Unauthorized user" });
      }

      const validator = vine.compile(newsSchema);
      const payload = await validator.validate(body);
      const image = req?.files?.image;

      if (image) {
        // * Validate new image
        const message = imageValidator(image?.size, image?.mimetype);

        if (message !== null) {
          return res.status(400).json({
            errors: {
              image: message,
            },
          });
        }

        // * Upload new image
        const imageName = uploadImage(image);
        payload.image = imageName;

        // * Delete old image
        removeImage(news.image);

        // * Update image
        await prisma.news.update({
          data: payload,
          where: {
            id: Number(id),
          },
        });
      }

      return res.status(200).json({
        status: 200,
        message: "News updated successfully.",
      });
    } catch (error) {
      console.log("The error is : ", error);
      if (error instanceof errors.E_VALIDATION_ERROR) {
        return res.status(400).json({ errors: error.messages });
      } else {
        return res.status(500).json({
          status: 500,
          message: "Something went wrong. Please try again.",
        });
      }
    }
  }

  static async destroy(req, res) {
    try {
      const { id } = req.params;
      const user = req.user;

      const news = await prisma.news.findUnique({
        where: {
          id: Number(id),
        },
      });

      if (user.id !== news.user_id) {
        return res.status(401).json({ message: "Unauthorized user" });
      }

      // * Delete image from system
      removeImage(news.image);

      // * Delete news
      await prisma.news.delete({
        where: {
          id: Number(id),
        },
      });

      return res.status(200).json({
        status: 200,
        message: "News deleted successfully.",
      });
    } catch (error) {
      console.log("The error is : ", error);
      if (error instanceof errors.E_VALIDATION_ERROR) {
        return res.status(400).json({ errors: error.messages });
      } else {
        return res.status(500).json({
          status: 500,
          message: "Something went wrong. Please try again.",
        });
      }
    }
  }
}

export default NewsController;
