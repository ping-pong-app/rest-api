import { Request, Response } from "express";
import admin from "firebase-admin";
import DecodedIdToken = admin.auth.DecodedIdToken;
import { Ping, Rest } from "../../lib";
import { PingService } from "../../services";
import { getTokenPayload } from "./common";

export const performPing = async (req: Request<{}, {}, Ping, {}>, res: Response) => {
    getTokenPayload(res,
        async (payload: DecodedIdToken) => {
            const userId = payload.uid;
            const body = req.body;
            await PingService.pingGroup(body, userId);
            res.status(Rest.STATUS_NO_CONTENT).send();
        },
        () => {
            res.status(Rest.STATUS_UNAUTHORIZED).send();
        });
};
