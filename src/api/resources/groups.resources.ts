import { Request, Response } from "express";
import { GroupsService } from "../../services";
import { Group, QueryBuilder, RequestQuery, Rest } from "../../lib";
import { getTokenPayload } from "./common";


export const getGroups = async (req: Request, res: Response) => {
    const queryParams = QueryBuilder
        .newBuilder()
        .buildQuery(req.query as RequestQuery)
        .build();
    
    const payload = getTokenPayload(res);
    
    const userId = payload.uid;
    const entityList = await GroupsService.findAll(queryParams, userId);
    
    res.status(Rest.STATUS_OK)
        .header(Rest.X_TOTAL_COUNT, entityList.count.toString(10))
        .json(entityList.entities);
};

export const getGroup = async (req: Request, res: Response) => {
    const groupId = req.params.id;
    const payload = getTokenPayload(res);
    const ownerId = payload.uid;
    const group = await GroupsService.find(groupId, ownerId);
    
    res.status(Rest.STATUS_OK).json(group);
};

export const getGroupMembers = async (req: Request, res: Response) => {
    const groupId = req.params.id;
    const payload = getTokenPayload(res);
    const userId = payload.uid;
    
    const members = await GroupsService.findGroupMembers(groupId, userId);
    
    res.status(Rest.STATUS_OK)
        .header(Rest.X_TOTAL_COUNT, members.count.toString(10))
        .json(members.entities);
};

export const createGroup = async (req: Request<{}, Group, Group, {}>, res: Response) => {
    const group = req.body;
    const payload = getTokenPayload(res);
    const ownerId = payload.uid;
    const createdGroup = await GroupsService.create(group, ownerId);
    
    res.status(Rest.STATUS_CREATED)
        .header(Rest.LOCATION, "/v1/groups/" + createdGroup.id)
        .json(createdGroup);
};

export const deleteGroup = async (req: Request, res: Response) => {
    const groupId = req.params.id;
    const payload = getTokenPayload(res);
    const ownerId = payload.uid;
    
    await GroupsService.delete(groupId, ownerId);
    res.status(Rest.STATUS_NO_CONTENT).send();
};

export const leaveGroup = async (req: Request, res: Response) => {
    const groupId = req.params.id;
    const payload = getTokenPayload(res);
    const userId = payload.uid;
    
    await GroupsService.leaveGroup(groupId, userId);
    res.status(Rest.STATUS_NO_CONTENT).send();
};
