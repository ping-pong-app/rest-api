import { Route } from "../../config";
import { authenticateUser } from "../middlewares";
import { createGroup, deleteGroup, getGroup, getGroupMembers, getGroups } from "../resources/groups.resources";
import { getGroupInvites } from "../resources/invitation.resource";

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
        path: "/v1/groups",
        method: "post",
        handler: [
            authenticateUser,
            createGroup
        ]
    },
    {
        path: "/v1/groups/:id/invites",
        method: "get",
        handler: [
            authenticateUser,
            getGroupInvites
        ]
    },
    {
        path: "/v1/groups/:id/members",
        method: "get",
        handler: [
            authenticateUser,
            getGroupMembers
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
        path: "/v1/groups/:id",
        method: "delete",
        handler: [
            authenticateUser,
            deleteGroup
        ]
    }
];
