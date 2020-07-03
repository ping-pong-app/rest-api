import { Router } from "express";
import cors from "cors";
import compression from "compression";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import helmet from "helmet";


export const handleCors = (router: Router) => {
    router.use(cors({
        credentials: true,
        origin: true
    }));
};

export const handleBodyRequestParsing = (router: Router) => {
    router.use(bodyParser.urlencoded({extended: true}));
    router.use(bodyParser.json());
};

export const handleCompression = (router: Router) => {
    router.use(compression());
};

export const handleCookieParsing = (router: Router) => {
    router.use(cookieParser());
};

export const handleBasicSecurity = (router: Router) => {
    router.use(helmet());
};
