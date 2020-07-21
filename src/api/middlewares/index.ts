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
    FcmSchemaServlet,
} from "./servlets";

export { developmentModeFilter, authenticateUser } from "./filters";

export const middlewares: MiddlewareSetupFunction[] = [
    handleCors,
    handleBasicSecurity,
    handleBodyRequestParsing,
    handleCompression,
    handleCookieParsing,
    SwaggerServlet,
    SwaggerUIServlet,
    FcmSchemaServlet,
];

export const errorMiddlewares: MiddlewareSetupFunction[] = [
    handle404Error,
    handleCustomError,
    handleUnknownError
];
