const path = require("path");
const express = require("express");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const xss = require("xss-clean");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const userRouter = require("./routes/userRoutes");
const conversationRouter = require("./routes/conversationRoutes");

const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");
const { setupFastApiListerners } = require('./services/redis')

const dotenv = require("dotenv");
dotenv.config({ path: ".env" });

const app = express();
// Set security HTTP headers
app.use(helmet());

// Development logging
app.use(morgan("dev"));

const corsOption = {
  origin: "*"
};
app.use(cors(corsOption));
// Limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour!",
});
app.use("/api", limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());

// Data sanitization against XSS
app.use(xss());

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  console.log(req.cookies);
  next();
});

setupFastApiListerners()

// API Routes
app.use("/api/v1/users", userRouter);
app.use("/api/v1/conversations", conversationRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
