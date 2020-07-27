import { Request, Response } from "express";
import { Ping, Rest } from "../../lib";
import { PingService } from "../../services";
import { getTokenPayload } from "./common";

export const performPing = async (req: Request<{}, {}, Ping, {}>, res: Response) => {
    const payload = getTokenPayload(res);
    
    const userId = payload.uid;
    const body = req.body;
    
    await PingService.pingGroup(body, userId);
    res.status(Rest.STATUS_NO_CONTENT).send();
    
};
