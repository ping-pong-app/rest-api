import { Request, Response } from "express";
import { Ping, PingResponse, Rest } from "../../lib";
import { PingService } from "../../services";
import { getTokenPayload } from "./common";

export const getPings = async (req: Request, res: Response) => {
    const payload = getTokenPayload(res);
    const userId = payload.uid;
    
    const pings = await PingService.getPings(userId);
    res.status(Rest.STATUS_OK)
        .header(Rest.X_TOTAL_COUNT, pings.count.toString(10))
        .json(pings);
};

export const getPingResponses = async (req: Request, res: Response) => {
    const payload = getTokenPayload(res);
    const userId = payload.uid;
    const pingId = req.params.pingId;
    
    const aggregatedResponses = await PingService.getPingResponses(pingId, userId);
    res.status(Rest.STATUS_OK).json(aggregatedResponses);
};

export const performPing = async (req: Request<{}, {}, Ping, {}>, res: Response) => {
    const payload = getTokenPayload(res);
    
    const userId = payload.uid;
    const body = req.body;
    
    const pingIdentifier = await PingService.pingGroup(body, userId);
    res.status(Rest.STATUS_CREATED).json(pingIdentifier);
};

export const handlePingResponse = async (req: Request<{}, {}, PingResponse, {}>, res: Response) => {
    const payload = getTokenPayload(res);
    const userId = payload.uid;
    const body = req.body;
    
    body.userId = userId;
    
    const pingResponseIdentifier = await PingService.handlePingResponse(body);
    res.status(Rest.STATUS_CREATED).json(pingResponseIdentifier);
};
