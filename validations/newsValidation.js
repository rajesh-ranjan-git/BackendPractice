import vine from "@vinejs/vine";
import { CustomErrorReporter } from "./customErrorReporter.js";

// * Custom Error Reporter
vine.errorReporter = () => new CustomErrorReporter();

export const newsSchema = vine.object({
  title: vine.string().minLength(5).maxLength(200),
  content: vine.string().minLength(10).maxLength(30000),
});
