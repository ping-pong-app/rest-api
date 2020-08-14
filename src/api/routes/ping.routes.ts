import { Route } from "../../config";
import { authenticateUser } from "../middlewares";
import { getPingResponses, handlePingResponse, performPing } from "../resources/ping.resource";


export const routes: Route[] = [
    {
        path: "/v1/ping/list/:id",
        method: "get",
        handler: [
            authenticateUser,
            getPingResponses
        ]
    },
    {
        path: "/v1/ping",
        method: "post",
        handler: [
            authenticateUser,
            performPing
        ]
    },
    {
        path: "/v1/ping/response",
        method: "post",
        handler: [
            authenticateUser,
            handlePingResponse
        ]
    }
];
