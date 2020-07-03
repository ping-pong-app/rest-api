import http from "http";
import "express-async-errors";
import express from "express";
import { applyMiddleware, applyRoutes, initConfiguration } from "./config";
import { errorMiddlewares, middlewares } from "./api/middlewares";
import { routes } from "./api/routes";

const router = express();

applyMiddleware(middlewares, router);
applyRoutes(routes, router);
applyMiddleware(errorMiddlewares, router);

const {PORT = 3000} = process.env;
const server = http.createServer(router);

async function startServer() {
    await initConfiguration();
    server.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}

startServer();
