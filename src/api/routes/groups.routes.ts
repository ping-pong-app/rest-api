import { Route } from "../../config";
import { createGroup, deleteGroup, getGroup, getGroups } from "../resources/groups.resources";
import { propagateTokenPayload } from "../middlewares";

export const routes: Route[] = [
    {
        path: "/v1/groups",
        method: "get",
        handler: [
            propagateTokenPayload,
            getGroups
        ]
    },
    {
        path: "/v1/groups/:id",
        method: "get",
        handler: [
            propagateTokenPayload,
            getGroup
        ]
    },
    {
        path: "/v1/groups",
        method: "post",
        handler: [
            propagateTokenPayload,
            createGroup
        ]
    },
    {
        path: "/v1/groups/:id",
        method: "delete",
        handler: [
            propagateTokenPayload,
            deleteGroup
        ]
    }
];
