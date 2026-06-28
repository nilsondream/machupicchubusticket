import { CorsOptions } from "cors";

const allowedOrigins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
];

export const corsOptions: CorsOptions = {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error(`Origin ${origin} no permitido por CORS`));
        }
    },
    credentials: true,
};