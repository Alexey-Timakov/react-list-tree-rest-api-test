import axios from "axios";

export const API_URL = "http://185.244.172.108:8081/v1/outlay-rows/entity/151/row";

export const $api = axios.create({
  baseURL: API_URL,
});
