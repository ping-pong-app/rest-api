import { Route } from "../../config";
import { livenessCheck, readinessCheck } from "../resources/actuator.resource";


export const routes: Route[] = [
    {
        path: "/health/live",
        method: "get",
        handler: [
            livenessCheck
        ]
    },
    {
        path: "/health/ready",
        method: "get",
        handler: [
            readinessCheck
        ]
    }
];
