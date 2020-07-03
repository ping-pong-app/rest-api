import { Route } from "../../config";
import { routes as actuatorRoutes } from "./actuator.routes";
import { routes as groupsRoutes } from "./groups.routes";

export const routes: Route[] = [
    ...actuatorRoutes,
    ...groupsRoutes
];
