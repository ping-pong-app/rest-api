import { Route } from "../../config";
import { createGroup, deleteGroup, getGroup, getGroups } from "../resources/groups.resources";

export const routes: Route[] = [
    {
        path: "/v1/groups",
        method: "get",
        handler: [
            getGroups
        ]
    },
    {
        path: "/v1/groups/:id",
        method: "get",
        handler: [
            getGroup
        ]
    },
    {
        path: "/v1/groups",
        method: "post",
        handler: [
            createGroup
        ]
    },
    {
        path: "/v1/groups/:id",
        method: "delete",
        handler: [
            deleteGroup
        ]
    }
];
