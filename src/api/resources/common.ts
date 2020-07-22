import { Response } from "express";
import admin from "firebase-admin";
import DecodedIdToken = admin.auth.DecodedIdToken;

export type PayloadSuccess = (payload: DecodedIdToken) => void;
export type PayloadError = () => void;

export const getTokenPayload = (res: Response, onSuccess: PayloadSuccess, onError: PayloadError): void => {
    const payload: DecodedIdToken = res.locals.jwt;
    if (payload) {
        onSuccess(payload);
    } else {
        onError();
    }
};
