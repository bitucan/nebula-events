import axios from "axios";

export const nebula = axios.create({
  url: `${process.env.API_URL}`,
});
