import { Request, Response } from "express";
import { GroupsService } from "../../services";
import { Group, QueryBuilder, RequestQuery, GroupMembership } from "../../lib";
import admin from "firebase-admin";
import DecodedIdToken = admin.auth.DecodedIdToken;


export const getGroups = async (req: Request, res: Response) => {
    const queryParams = QueryBuilder
        .newBuilder()
        .buildQuery(req.query as RequestQuery)
        .build();
    
    const payload: DecodedIdToken = res.locals.jwt;
    if (payload) {
        const userId = payload.uid;
        const entityList = await GroupsService.findAll(queryParams, userId);
        
        res
            .status(200)
            .header("X-Total-Count", entityList.count.toString(10))
            .json(entityList.entities);
    } else {
        res.status(401).send();
    }
};

export const getGroup = async (req: Request, res: Response) => {
    const groupId = req.params.id;
    
    const payload: DecodedIdToken = res.locals.jwt;
    if (payload) {
        const ownerId = payload.uid;
        const group = await GroupsService.find(groupId, ownerId);
        res.status(200).json(group);
    } else {
        res.status(401).send();
    }
};

export const createGroup = async (req: Request<{}, Group, Group, {}>, res: Response) => {
    const group = req.body;
    const payload: DecodedIdToken = res.locals.jwt;
    
    if (payload) {
        const ownerId = payload.uid;
        const createdGroup = await GroupsService.create(group, ownerId);
    
        res.status(201)
            .header("Location", "/v1/groups/" + createdGroup.id)
            .json(createdGroup);
    } else {
        res.status(401).send();
    }
};

export const deleteGroup = async (req: Request, res: Response) => {
    const groupId = req.params.id;
    const payload: DecodedIdToken = res.locals.jwt;
    
    if (payload) {
        const ownerId = payload.uid;
        
        await GroupsService.delete(groupId, ownerId);
        res.status(204).send();
    } else {
        res.status(401).send();
    }
};

export const addUserToGroup = async (req: Request<{}, {}, GroupMembership, {}>, res: Response) => {
    const payload: DecodedIdToken = res.locals.jwt;
    if (payload) {
        const ownerId = payload.uid;
        await GroupsService.addUserToGroup(req.body, ownerId);
        res.status(204).send();
    } else {
        res.status(401).send();
    }
};
