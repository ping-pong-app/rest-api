import { MiddlewareSetupFunction } from "../../config";
import {
    handleBasicSecurity,
    handleBodyRequestParsing,
    handleCompression,
    handleCookieParsing,
    handleCors
} from "./common.middlewares";
import { handle404Error, handleCustomError, handleUnknownError } from "./error.middlewares";
import {
    SwaggerServlet,
    SwaggerUIServlet,
} from "./servlets";

export { developmentModeFilter, propagateTokenPayload } from "./filters";

export const middlewares: MiddlewareSetupFunction[] = [
    handleCors,
    handleBasicSecurity,
    handleBodyRequestParsing,
    handleCompression,
    handleCookieParsing,
    SwaggerServlet,
    SwaggerUIServlet,
];

export const errorMiddlewares: MiddlewareSetupFunction[] = [
    handle404Error,
    handleCustomError,
    handleUnknownError
];
