import http from "http";
import "express-async-errors";
import express from "express";
import { applyMiddleware, applyRoutes, initConfiguration } from "./config";


const router = express();


// import routes and middlewares after authentication is finished,
// due to middleware function not yet instantiated on apply function call.
import { errorMiddlewares, middlewares } from "./api/middlewares";
applyMiddleware(middlewares, router);

import { routes } from "./api/routes";
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
