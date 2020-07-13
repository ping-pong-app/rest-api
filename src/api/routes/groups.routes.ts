import { Route } from "../../config";
import { createGroup, deleteGroup, getGroup, getGroups } from "../resources/groups.resources";
import { AuthConfigurator } from "../../config/auth.config";
import { propagateTokenPayload } from "../middlewares";

export const routes: Route[] = [
    {
        path: "/v1/groups",
        method: "get",
        handler: [
            AuthConfigurator.getInstance().protect(),
            propagateTokenPayload,
            getGroups
        ]
    },
    {
        path: "/v1/groups/:id",
        method: "get",
        handler: [
            AuthConfigurator.getInstance().protect(),
            propagateTokenPayload,
            getGroup
        ]
    },
    {
        path: "/v1/groups",
        method: "post",
        handler: [
            AuthConfigurator.getInstance().protect(),
            propagateTokenPayload,
            createGroup
        ]
    },
    {
        path: "/v1/groups/:id",
        method: "delete",
        handler: [
            AuthConfigurator.getInstance().protect(),
            propagateTokenPayload,
            deleteGroup
        ]
    }
];
