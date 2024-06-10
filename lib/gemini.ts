import { GoogleGenerativeAI } from "@google/generative-ai";
const apiKey = process.env.GOOGLE_API_KEY || ""
export const genAI = new GoogleGenerativeAI(apiKey);