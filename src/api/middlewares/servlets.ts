import { NextFunction, Request, Response, Router } from "express";
import { join } from "path";
import swaggerUi from "swagger-ui-express";
import swagger from "../docs/openapi.json";
import "../docs/fcm-ping.json";
import "../docs/fcm-invite.json";


export const FcmSchemaServlet = (router: Router) => {
    router.use("/schemas/fcm/ping", (req: Request, res: Response, _: NextFunction) => {
        res.sendFile(join(__dirname, "..", "docs/fcm-ping.json"));
    });
    router.use("/schemas/fcm/invite", (req: Request, res: Response, _: NextFunction) => {
        res.sendFile(join(__dirname, "..", "docs/fcm-invite.json"));
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
