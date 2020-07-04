import { Route } from "../../config";
import { routes as actuatorRoutes } from "./actuator.routes";
import { routes as groupsRoutes } from "./groups.routes";
import { routes as testRoutes } from "./test.routes";

export const routes: Route[] = [
    ...actuatorRoutes,
    ...groupsRoutes,
    ...testRoutes
];
