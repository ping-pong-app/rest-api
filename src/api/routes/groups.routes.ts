import { Route } from "../../config";
import { createGroup, deleteGroup, getGroup, getGroups } from "../resources/groups.resources";
import { authenticateUser } from "../middlewares";

export const routes: Route[] = [
    {
        path: "/v1/groups",
        method: "get",
        handler: [
            authenticateUser,
            getGroups
        ]
    },
    {
        path: "/v1/groups/:id",
        method: "get",
        handler: [
            authenticateUser,
            getGroup
        ]
    },
    {
        path: "/v1/groups",
        method: "post",
        handler: [
            authenticateUser,
            createGroup
        ]
    },
    {
        path: "/v1/groups/:id",
        method: "delete",
        handler: [
            authenticateUser,
            deleteGroup
        ]
    }
];
