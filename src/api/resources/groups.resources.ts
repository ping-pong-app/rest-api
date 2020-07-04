import { Request, Response } from "express";
import { GroupsService } from "../../services/groups.service";
import { Group, QueryBuilder, RequestQuery } from "../../lib";


export const getGroups = async (req: Request, res: Response) => {
    const queryParams = QueryBuilder
        .newBuilder()
        .buildQuery(req.query as RequestQuery)
        .build();
    
    const entityList = await GroupsService.findAll(queryParams);
    
    res
        .status(200)
        .header("X-Total-Count", entityList.count.toString(10))
        .json(entityList.entities);
};

export const getGroup = async (req: Request, res: Response) => {
    const groupId = req.params.id;
    const group = await GroupsService.find(groupId);
    res.status(200).json(group);
};

export const createGroup = async (req: Request<{}, Group, Group, {}>, res: Response) => {
    const group = req.body;
    const createdGroup = await GroupsService.create(group);
    res.status(201)
        .header("Location", "/v1/groups/" + createdGroup.id)
        .json(createdGroup);
};

export const deleteGroup = async (req: Request, res: Response) => {
    const groupId = req.params.id;
    await GroupsService.delete(groupId);
    res.status(204).send();
};
