import { Route } from "../../config";
import { createGroup, deleteGroup, getGroup, getGroups } from "../resources/groups.resources";
import { AuthConfigurator } from "../../config/auth.config";

export const routes: Route[] = [
    {
        path: "/v1/groups",
        method: "get",
        handler: [
            AuthConfigurator.getInstance().protect(),
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
