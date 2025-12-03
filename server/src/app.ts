import express, { Request, Response } from "express";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";
import helmet from "helmet";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import errorMiddleware from "./middlewares/errorHandler.middleware";

import authRoute from "./routes/auth.route";
import sessionRoute from "./routes/session.route";
import notificationRoute from "./routes/notification.route";
import mediaRoute from "./routes/media.route";
import profileRoute from "./routes/profile.route";
import postRoute from "./routes/post.route";
import commentRoute from "./routes/comment.route";
import storyRoute from "./routes/story.route";

export const app: express.Application = express();

// Rate-Limiting
const rateLimiter = rateLimit({
  windowMs: 150 * 60 * 1000,
  max: 500,
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (req: Request, res: Response) => {
    res.status(429).json({
      success: false,
      error: "Rate limit exceeded",
      message: "Too many requests. Try again later.",
    });
  },
});
app.use(rateLimiter);

// CORS
const allowedOrigins: string[] =
  process.env.NODE_ENV === "production" && process.env.Frontend_Production_url
    ? [process.env.Frontend_Production_url]
    : [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://192.168.0.100:5173", // Local network access
      ];

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  credentials: true,
};

app.use(cors(corsOptions));

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: [
          "'self'",
          "http://localhost:5173",
          "http://127.0.0.1:5173",
          "http://192.168.0.100:5173",
        ],
        scriptSrc: [
          "'self'",
          "'unsafe-inline'",
          "http://localhost:5173",
          "http://127.0.0.1:5173",
          "http://192.168.0.100:5173",
        ], // Allow Vite's HMR
        styleSrc: ["'self'", "'unsafe-inline'"], // Allow inline styles (CSS-in-JS)
        imgSrc: ["'self'", "data:"], // Allow base64 images
        connectSrc: [
          "'self'",
          "http://localhost:4000",
          "http://192.168.0.100:4000",
          "ws://localhost:5173",
          "ws://127.0.0.1:5173",
          "ws://192.168.0.100:5173",
        ], // For API + Vite HMR
      },
    },
  })
);

// Body Parsing
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Security Middlewares
app.use(mongoSanitize());

// ===============================================
// Routes will be here
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/sessions", sessionRoute);
app.use("/api/v1/notification", notificationRoute);
app.use("/api/v1/profile", profileRoute);
app.use("/api/v1/media", mediaRoute);
app.use("/api/v1/post", postRoute);
app.use("/api/v1/comment", commentRoute);
app.use("/api/v1/story",storyRoute);
// ===============================================

app.use(errorMiddleware);

//Testing route to check server is running or not
app.get("/health", function (req: Request, res: Response): void {
  res.send("<h1>Server is running</h1>");
});

//Fallback response if any requested route is not available.
app.use((req, res) => {
  res.status(404).json({
    status: 404,
    success: false,
    message: "!Oops page not found",
  });
});
