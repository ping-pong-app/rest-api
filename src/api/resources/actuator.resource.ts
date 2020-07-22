import { Request, Response } from "express";
import { ActuatorService } from "../../services";
import { Rest } from "../../lib";

export const livenessCheck = async (request: Request, response: Response) => {
    const report = await ActuatorService.livenessCheck();
    if (report.status === "UP") {
        response.status(Rest.STATUS_OK).json(report);
    } else {
        response.status(Rest.STATUS_INTERNAL_SERVER_ERROR).json(report);
    }
};

export const readinessCheck = async (request: Request, response: Response) => {
    const report = await ActuatorService.readinessCheck();
    if (report.status === "UP") {
        response.status(Rest.STATUS_OK).json(report);
    } else {
        response.status(Rest.STATUS_INTERNAL_SERVER_ERROR).json(report);
    }
};
