import { Request, Response } from "express";
import { ActuatorService } from "../../services";

export const livenessCheck = async (request: Request, response: Response) => {
    const report = await ActuatorService.livenessCheck();
    if (report.status === "UP") {
        response.status(200).json(report);
    } else {
        response.status(500).json(report);
    }
};

export const readinessCheck = async (request: Request, response: Response) => {
    const report = await ActuatorService.readinessCheck();
    if (report.status === "UP") {
        response.status(200).json(report);
    } else {
        response.status(500).json(report);
    }
};
