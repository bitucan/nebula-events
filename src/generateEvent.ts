import { Collection } from "./db";
import { v4 as uuid } from "uuid";
import axios from "axios";

export const generateCollectionEvent = async (collection: Collection) => {
  try {
    const res = await axios.post(
      "https://nebula-dev-hakrlu77ba-uc.a.run.app/v1/events/content",
      {
        collection,
      }
    );

    return {
      ...collection,
      workspace_id: "",
      id: uuid(),
      meta_title: res.data.meta_title,
      meta_description: res.data.meta_description,
      title_content_bottom: res.data.title_content_bottom,
      content_bottom: res.data.content_bottom,
      content_top: res.data.content_top,
      banner_id: "",
      tree_category_id: "",
      tree_category_name: "",
      products_ids: "",
    };
  } catch (error) {
    console.error("Error al enviar evento:", error);
    throw error;
  }
};
