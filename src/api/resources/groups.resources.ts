import { Request, Response } from "express";
import { GroupsService } from "../../services";
import { Group, QueryBuilder, RequestQuery } from "../../lib";
import admin from "firebase-admin";
import DecodedIdToken = admin.auth.DecodedIdToken;
import { getTokenPayload } from "./common";


export const getGroups = async (req: Request, res: Response) => {
    const queryParams = QueryBuilder
        .newBuilder()
        .buildQuery(req.query as RequestQuery)
        .build();
    
    getTokenPayload(res,
        async (payload: DecodedIdToken) => {
            
            const userId = payload.uid;
            const entityList = await GroupsService.findAll(queryParams, userId);
            
            res.status(200)
                .header("X-Total-Count", entityList.count.toString(10))
                .json(entityList.entities);
        },
        () => {
            res.status(401).send();
        });
};

export const getGroup = async (req: Request, res: Response) => {
    const groupId = req.params.id;
    
    getTokenPayload(res,
        async (payload: DecodedIdToken) => {
            
            const ownerId = payload.uid;
            const group = await GroupsService.find(groupId, ownerId);
            res.status(200).json(group);
        },
        () => {
            res.status(401).send();
        });
};

export const createGroup = async (req: Request<{}, Group, Group, {}>, res: Response) => {
    const group = req.body;
    
    getTokenPayload(res,
        async (payload: DecodedIdToken) => {
            
            const ownerId = payload.uid;
            const createdGroup = await GroupsService.create(group, ownerId);
            
            res.status(201)
                .header("Location", "/v1/groups/" + createdGroup.id)
                .json(createdGroup);
        },
        () => {
            res.status(401).send();
        });
    
};

export const deleteGroup = async (req: Request, res: Response) => {
    const groupId = req.params.id;
    
    getTokenPayload(res,
        async (payload: DecodedIdToken) => {
            const ownerId = payload.uid;
            await GroupsService.delete(groupId, ownerId);
            res.status(204).send();
        },
        () => {
            res.status(401).send();
        });
};
