import { Route } from "../../config";
import { getGroup, getGroups } from "../resources/groups.resources";

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
    }
];
