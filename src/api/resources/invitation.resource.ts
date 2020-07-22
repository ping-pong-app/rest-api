import { Request, Response } from "express";
import admin from "firebase-admin";
import DecodedIdToken = admin.auth.DecodedIdToken;
import { getTokenPayload } from "./common";
import { InvitationService } from "../../services";
import { Invitation } from "../../lib";

export const getOwnInvites = async (req: Request, res: Response) => {
    getTokenPayload(res,
        async (payload: DecodedIdToken) => {
            const userId = payload.uid;
            
            const invitations = await InvitationService.getUserInvites(userId);
            
            res.status(200)
                .header("X-Total-Count", invitations.count.toString(10))
                .json(invitations.entities);
            
        }, () => {
            res.status(401).send();
        });
};

export const getGroupInvites = async (req: Request, res: Response) => {
    getTokenPayload(res,
        async (payload: DecodedIdToken) => {
            const userId = payload.uid;
            const groupId = req.params.id;
            
            const invitations = await InvitationService.getGroupInvites(userId, groupId);
            
            res.status(200)
                .header("X-Total-Count", invitations.count.toString(10))
                .json(invitations.entities);
            
        }, () => {
            res.status(401).send();
        });
};

export const inviteUser = async (req: Request<{}, {}, Invitation, {}>, res: Response) => {
    getTokenPayload(res,
        async (payload: DecodedIdToken) => {
            const userId = payload.uid;
            
            await InvitationService.inviteUser(req.body, userId);
            
            res.status(201).send();
        }, () => {
            res.status(401).send();
        });
};

export const acceptInvite = async (req: Request, res: Response) => {
    getTokenPayload(res,
        async (payload: DecodedIdToken) => {
            const userId = payload.uid;
            const invitationId = req.params.id;
            
            await InvitationService.acceptInvite(invitationId, userId);
            
            res.status(204).send();
        }, () => {
            res.status(401).send();
        });
};

export const rejectInvite = async (req: Request, res: Response) => {
    getTokenPayload(res,
        async (payload: DecodedIdToken) => {
            const userId = payload.uid;
            const invitationId = req.params.id;
            
            await InvitationService.rejectInvite(invitationId, userId);
            
            res.status(204).send();
        }, () => {
            res.status(401).send();
        });
};

export const cancelInvite = async (req: Request, res: Response) => {
    getTokenPayload(res,
        async (payload: DecodedIdToken) => {
            const userId = payload.uid;
            const invitationId = req.params.id;
            
            await InvitationService.cancelInvite(invitationId, userId);
            
            res.status(204).send();
        }, () => {
            res.status(401).send();
        });
};
