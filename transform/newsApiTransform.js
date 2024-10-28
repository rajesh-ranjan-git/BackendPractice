import { getImageUrl } from "../utils/helper.js";
import { default_profile_img } from "../public/images/profile_img.jpg";

class NewsApiTransform {
  static transform(news) {
    return {
      id: news.id,
      heading: news.title,
      news: news.content,
      image: getImageUrl(news.image),
      created_at: news.created_at,
      reporter: {
        id: news?.user.id,
        name: news?.user.name,
        profile:
          news?.user?.profile !== null
            ? getImageUrl(news?.user?.profile)
            : getImageUrl(default_profile_img),
      },
    };
  }
}

export default NewsApiTransform;
