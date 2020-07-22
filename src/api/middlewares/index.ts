import { MiddlewareSetupFunction } from "../../config";
import {
    handleBasicSecurity,
    handleBodyRequestParsing,
    handleCompression,
    handleCookieParsing,
    handleCors,
    handleVersionInfo
} from "./common.middlewares";
import { handle404Error, handleCustomError, handleUnknownError } from "./error.middlewares";
import {
    SwaggerServlet,
    SwaggerUIServlet,
    FcmSchemaServlet,
} from "./servlets";

export { developmentModeFilter, authenticateUser, versionInfoFilter } from "./filters";

export const middlewares: MiddlewareSetupFunction[] = [
    handleCors,
    handleBasicSecurity,
    handleBodyRequestParsing,
    handleCompression,
    handleCookieParsing,
    SwaggerServlet,
    SwaggerUIServlet,
    FcmSchemaServlet,
    handleVersionInfo
];

export const errorMiddlewares: MiddlewareSetupFunction[] = [
    handle404Error,
    handleCustomError,
    handleUnknownError
];
