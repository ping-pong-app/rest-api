import { NextFunction, Request, Response, Router } from "express";
import { join } from "path";
import swaggerUi from "swagger-ui-express";
import swagger from "../docs/openapi.json";


export const SwaggerServlet = (router: Router) => {
    router.use("/openapi/json", (req: Request, res: Response, next: NextFunction) => {
        res.sendFile(join(__dirname, "..", "docs/openapi.json"));
    });
};

export const SwaggerUIServlet = (router: Router) => {
    router.use("/openapi/ui", swaggerUi.serve, swaggerUi.setup(swagger));
};
