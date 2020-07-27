import { Response } from "express";
import admin from "firebase-admin";
import DecodedIdToken = admin.auth.DecodedIdToken;
import { UnathorizedError } from "../../lib";


export const getTokenPayload = (res: Response): DecodedIdToken => {
    const payload: DecodedIdToken = res.locals.jwt;
    if (payload) {
        return payload;
    }
    throw new UnathorizedError();
};
