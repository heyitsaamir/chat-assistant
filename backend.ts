import axios from "axios";
import config from "./config";

export const ping = async () => {
  const response = await axios.get('/api/beginCollect?ping=true', {
    baseURL: process.env["BACKEND_ENDPOINT"]
  });
  return response.data;
};

export const addMessageContext = async (messageUrl: string, message: string, sender: string, additionalContext?: string) => {
  const response = await axios.post('/api/beginCollect', {
    rawText: message,
    rawTextUrl: messageUrl,
    sender,
    additionalContext,
    messageType: 'html'
  },
   {
    baseURL: process.env["BACKEND_ENDPOINT"]
  });
  return response.data;
};

export const queryForMessage = async (query: string) => {
  const response = await axios.post('/api/beginCollect', {
    query
  },
   {
    baseURL: process.env["BACKEND_ENDPOINT"]
  });
  return response.data;
};
