import { GoogleGenerativeAI } from "@google/generative-ai";
import { CONFIG } from "../config";

// Initialize the API
const genAI = new GoogleGenerativeAI(CONFIG.GEMINI_API_KEY);

// Rate limiting setup
let requestCount = 0;
let tokenCount = 0;
const resetTime = new Date();

// Rate limit constants
const RATE_LIMITS = {
   REQUESTS_PER_MINUTE: 15,
   TOKENS_PER_MINUTE: 1000000,
   REQUESTS_PER_DAY: 1500,
};

class GeminiService {
   constructor() {
      this.model = genAI.getGenerativeModel({ model: "gemini-pro" });
      this.cache = new Map();
   }

   async checkRateLimits() {
      const now = new Date();

      // Reset counters if a minute has passed
      if (now - resetTime > 60000) {
         requestCount = 0;
         tokenCount = 0;
         resetTime.setTime(now.getTime());
      }

      if (requestCount >= RATE_LIMITS.REQUESTS_PER_MINUTE) {
         throw new Error("Rate limit exceeded: Too many requests per minute");
      }

      if (tokenCount >= RATE_LIMITS.TOKENS_PER_MINUTE) {
         throw new Error("Rate limit exceeded: Token limit reached");
      }
   }

   generateCacheKey(interest, level) {
      return `${interest.toLowerCase()}_${level.toLowerCase()}`;
   }

   async getLearningStrategy(interest, level = "beginner") {
      try {
         await this.checkRateLimits();

         const cacheKey = this.generateCacheKey(interest, level);

         // Check cache first
         if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey);
         }

         const prompt = `
            Create a personalized learning strategy for ${interest} at ${level} level.
            Include:
            - A structured learning path
            - Recommended resources (top 3 each):
               * Online courses
               * Books
               * Practice platforms
            - Weekly study schedule (10 hours/week)
            - Key skills to master first
            - Project ideas for practical application
            
            Format the response in a clear, structured way using markdown.
         `;

         requestCount++;
         const result = await this.model.generateContent(prompt);
         const response = await result.response;
         const text = response.text();

         // Update token count (approximate)
         tokenCount += text.split(" ").length;

         // Cache the result
         this.cache.set(cacheKey, text);

         return text;
      } catch (error) {
         console.error("Gemini API Error:", error);
         throw error;
      }
   }

   async getRecommendation(prompt) {
      try {
         const cacheKey = `recommendation_${prompt}`;

         if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey);
         }

         // Modify prompt to explicitly request JSON format
         const structuredPrompt = `
            ${prompt}
            Return ONLY a valid JSON object without any markdown formatting or additional text.
            The response should be a single JSON object containing the following structure:
            {
               "coreConcepts": ["concept1", "concept2"],
               "advancedTopics": ["topic1", "topic2"],
               "careerPaths": [{"role": "role1", "description": "desc1"}],
               "books": [{"title": "title1", "author": "author1", "level": "level1"}],
               "projects": [{"title": "title1", "description": "desc1", "skills": ["skill1"]}]
            }
         `;

         const result = await this.model.generateContent(structuredPrompt);
         const response = await result.response;
         let text = response.text();

         // Clean up the response to ensure valid JSON
         text = text.replace(/```json\n?/g, '')
                   .replace(/```\n?/g, '')
                   .replace(/\n/g, '')
                   .trim();

         // Validate JSON before caching
         const parsedJson = JSON.parse(text);
         
         // Cache the valid JSON string
         this.cache.set(cacheKey, JSON.stringify(parsedJson));

         return JSON.stringify(parsedJson);
      } catch (error) {
         console.error("Gemini API Error:", error);
         // Return default strategy if API fails
         return JSON.stringify({
            coreConcepts: [
               "Basic Syntax and Data Types",
               "Control Structures",
               "Functions and Methods",
               "Object-Oriented Programming"
            ],
            advancedTopics: [
               "Design Patterns",
               "Performance Optimization",
               "Security Best Practices",
               "Testing Methodologies"
            ],
            careerPaths: [
               {
                  role: "Software Developer",
                  description: "Build and maintain applications"
               },
               {
                  role: "Technical Lead",
                  description: "Lead development teams and architect solutions"
               }
            ],
            books: [
               {
                  title: "Clean Code",
                  author: "Robert C. Martin",
                  level: "Intermediate"
               },
               {
                  title: "Design Patterns",
                  author: "Gang of Four",
                  level: "Advanced"
               }
            ],
            projects: [
               {
                  title: "Task Manager",
                  description: "Build a full-stack application",
                  skills: ["Frontend", "Backend", "Database"]
               },
               {
                  title: "E-commerce Platform",
                  description: "Create an online shopping system",
                  skills: ["API Integration", "Payment Processing", "User Auth"]
               }
            ]
         });
      }
   }
}

export const geminiService = new GeminiService();
