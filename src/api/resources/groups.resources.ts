import { Request, Response } from "express";
import { GroupsService } from "../../services/groups.service";
import { QueryBuilder, RequestQuery } from "../../lib";


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
