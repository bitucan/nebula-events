//@ts-ignore
import dbLocal from "db-local";

export type Collection = {
  index: number;
  id: string;
  created_by: string;
  url: string;
  category: string;
  title_content_top: string;
  content_top: string;
  title_content_bottom: string;
  content_bottom: string;
  meta_title: string;
  meta_description: string;
  hyper_links: string[];
  keywords: string;
  state: string;
  internal_links: string[];
  text_reference: string;
};

const { Schema } = new dbLocal({ path: "./databases" });

export const collections = Schema("collections", {
  index: { type: Number },
  id: { type: String },
  created_by: { type: String },
  url: { type: String },
  category: { type: String },
  title_content_top: { type: String },
  content_top: { type: String },
  title_content_bottom: { type: String },
  content_bottom: { type: String },
  meta_title: { type: String },
  meta_description: { type: String },
  hyper_links: { type: Array<String> },
  keywords: { type: String },
  state: { type: String },
  internal_links: { type: Array<String> },
  text_reference: { type: String },
});

export const events_collections = Schema("black-friday", {
  index: { type: Number },
  id: { type: String },
  created_by: { type: String },
  url: { type: String },
  category: { type: String },
  title_content_top: { type: String },
  content_top: { type: String },
  title_content_bottom: { type: String },
  content_bottom: { type: String },
  meta_title: { type: String },
  meta_description: { type: String },
  hyper_links: { type: Array<String> },
  keywords: { type: String },
  state: { type: String },
  internal_links: { type: Array<String> },
  text_reference: { type: String },
});

export function loadCollections(lastIdProcessed?: number): Collection[] {
  return collections.find();
}
