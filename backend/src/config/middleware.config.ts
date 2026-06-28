import express, { Express } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { corsOptions } from "./cors.config";

export const configureMiddleware = (app: Express): void => {
    app.use(cors(corsOptions));
    app.use(cookieParser());
    app.use(express.json());
};