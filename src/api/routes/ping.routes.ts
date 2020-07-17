import { Route } from "../../config";
import { authenticateUser } from "../middlewares";
import { performPing } from "../resources/ping.resource";


export const routes: Route[] = [
    {
        path: "/v1/ping",
        method: "post",
        handler: [
            authenticateUser,
            performPing
        ]
    }
];
