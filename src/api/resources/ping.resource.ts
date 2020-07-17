import { Request, Response } from "express";
import admin from "firebase-admin";
import DecodedIdToken = admin.auth.DecodedIdToken;
import { Ping } from "../../lib";
import { PingService } from "../../services";

export const performPing = async (req: Request<{}, {}, Ping, {}>, res: Response) => {
    // const payload: DecodedIdToken = res.locals.jwt;
    const body = req.body;
    await PingService.pingGroup(body);
    res.status(204).send();
};
