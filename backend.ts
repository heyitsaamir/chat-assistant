import axios from "axios";
import config from "./config";

interface Wiki {
  path: string;
  order: number;
  gitItemPath: string;
  subPages: any[];
  url: string;
  remoteUrl: string;
  id: number;
  content: string;
}

export const ping = async () => {
  const response = await axios.get<Wiki>('/api/beginCollect?ping=true', {
    baseURL: process.env["BACKEND_ENDPOINT"]
  });
  return response.data;
};

export const addMessageContext = async (messageUrl: string, message: string) => {
  const response = await axios.post<Wiki>('/api/beginCollect', {
    rawText: message,
    rawTextUrl: messageUrl
  },
   {
    baseURL: process.env["BACKEND_ENDPOINT"]
  });
  return response.data;
};
