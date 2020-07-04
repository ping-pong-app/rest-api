import { Request, Response } from "express";
import { TestService } from "../../services/test.service";


export const fillInitialData = async (request: Request, response: Response) => {
    await TestService.fillInitialData();
    response.status(204).send();
};

export const emptyData = async (request: Request, response: Response) => {
    await TestService.emptyData();
    response.status(204).send();
};
