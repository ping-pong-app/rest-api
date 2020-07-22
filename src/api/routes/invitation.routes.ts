import { Route } from "../../config";
import { authenticateUser } from "../middlewares";
import { acceptInvite, cancelInvite, getOwnInvites, inviteUser, rejectInvite } from "../resources/invitation.resource";

export const routes: Route[] = [
    {
        path: "/v1/invites",
        method: "get",
        handler: [
            authenticateUser,
            getOwnInvites
        ]
    },
    {
        path: "/v1/invites",
        method: "post",
        handler: [
            authenticateUser,
            inviteUser
        ]
    },
    {
        path: "/v1/invites/:id/accept",
        method: "post",
        handler: [
            authenticateUser,
            acceptInvite
        ]
    },
    {
        path: "/v1/invites/:id/reject",
        method: "delete",
        handler: [
            authenticateUser,
            rejectInvite
        ]
    },
    {
        path: "/v1/invites/:id/cancel",
        method: "delete",
        handler: [
            authenticateUser,
            cancelInvite
        ]
    }
];
