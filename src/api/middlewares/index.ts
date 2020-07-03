import { MiddlewareSetupFunction } from "../../config";
import {
    handleBasicSecurity,
    handleBodyRequestParsing,
    handleCompression,
    handleCookieParsing,
    handleCors
} from "./common.middlewares";
import { handle404Error, handleCustomError, handleUnknownError } from "./error.middlewares";


export const middlewares: MiddlewareSetupFunction[] = [
    handleCors,
    handleBasicSecurity,
    handleBodyRequestParsing,
    handleCompression,
    handleCookieParsing
];

export const errorMiddlewares: MiddlewareSetupFunction[] = [
    handle404Error,
    handleCustomError,
    handleUnknownError
];
