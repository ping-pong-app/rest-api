import { NextFunction, Request, Response, Router } from "express";
import { join } from "path";
import swaggerUi from "swagger-ui-express";
import swagger from "../docs/openapi.json";
import "../docs/fcm.json";


export const FcmSchemaServlet = (router: Router) => {
    router.use("/schemas/fcm", (req: Request, res: Response, _: NextFunction) => {
        res.sendFile(join(__dirname, "..", "docs/fcm.json"));
    });
};

export const SwaggerServlet = (router: Router) => {
    router.use("/openapi/json", (req: Request, res: Response, _: NextFunction) => {
        res.sendFile(join(__dirname, "..", "docs/openapi.json"));
    });
};

export const SwaggerUIServlet = (router: Router) => {
    router.use("/openapi/ui", swaggerUi.serve, swaggerUi.setup(swagger, {
        customSiteTitle: "Ping API",
    }));
};
