import { Request, Response } from "express";
import admin from "firebase-admin";
import DecodedIdToken = admin.auth.DecodedIdToken;
import { getTokenPayload } from "./common";
import { InvitationService } from "../../services";
import { Invitation, Rest } from "../../lib";

export const getOwnInvites = async (req: Request, res: Response) => {
    getTokenPayload(res,
        async (payload: DecodedIdToken) => {
            const userId = payload.uid;
            
            const invitations = await InvitationService.getUserInvites(userId);
            
            res.status(Rest.STATUS_OK)
                .header(Rest.X_TOTAL_COUNT, invitations.count.toString(10))
                .json(invitations.entities);
            
        }, () => {
            res.status(Rest.STATUS_UNAUTHORIZED).send();
        });
};

export const getGroupInvites = async (req: Request, res: Response) => {
    getTokenPayload(res,
        async (payload: DecodedIdToken) => {
            const userId = payload.uid;
            const groupId = req.params.id;
            
            const invitations = await InvitationService.getGroupInvites(userId, groupId);
            
            res.status(Rest.STATUS_OK)
                .header(Rest.X_TOTAL_COUNT, invitations.count.toString(10))
                .json(invitations.entities);
            
        }, () => {
            res.status(Rest.STATUS_UNAUTHORIZED).send();
        });
};

export const inviteUser = async (req: Request<{}, {}, Invitation, {}>, res: Response) => {
    getTokenPayload(res,
        async (payload: DecodedIdToken) => {
            const userId = payload.uid;
            
            const identifier = await InvitationService.inviteUser(req.body, userId);
            
            res.status(Rest.STATUS_CREATED).json(identifier);
        }, () => {
            res.status(Rest.STATUS_UNAUTHORIZED).send();
        });
};

export const acceptInvite = async (req: Request, res: Response) => {
    getTokenPayload(res,
        async (payload: DecodedIdToken) => {
            const userId = payload.uid;
            const invitationId = req.params.id;
            
            await InvitationService.acceptInvite(invitationId, userId);
            
            res.status(Rest.STATUS_NO_CONTENT).send();
        }, () => {
            res.status(Rest.STATUS_UNAUTHORIZED).send();
        });
};

export const rejectInvite = async (req: Request, res: Response) => {
    getTokenPayload(res,
        async (payload: DecodedIdToken) => {
            const userId = payload.uid;
            const invitationId = req.params.id;
            
            await InvitationService.rejectInvite(invitationId, userId);
            
            res.status(Rest.STATUS_NO_CONTENT).send();
        });
};

export const cancelInvite = async (req: Request, res: Response) => {
    getTokenPayload(res,
        async (payload: DecodedIdToken) => {
            const userId = payload.uid;
            const invitationId = req.params.id;
            
            await InvitationService.cancelInvite(invitationId, userId);
            
            res.status(Rest.STATUS_NO_CONTENT).send();
        }, () => {
            res.status(Rest.STATUS_UNAUTHORIZED).send();
        });
};
