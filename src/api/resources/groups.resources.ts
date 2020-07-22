import { Request, Response } from "express";
import { GroupsService } from "../../services";
import { Group, QueryBuilder, RequestQuery, Rest } from "../../lib";
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
            
            res.status(Rest.STATUS_OK)
                .header(Rest.X_TOTAL_COUNT, entityList.count.toString(10))
                .json(entityList.entities);
        },
        () => {
            res.status(Rest.STATUS_UNAUTHORIZED).send();
        });
};

export const getGroup = async (req: Request, res: Response) => {
    const groupId = req.params.id;
    
    getTokenPayload(res,
        async (payload: DecodedIdToken) => {
            
            const ownerId = payload.uid;
            const group = await GroupsService.find(groupId, ownerId);
            res.status(Rest.STATUS_OK).json(group);
        },
        () => {
            res.status(Rest.STATUS_UNAUTHORIZED).send();
        });
};

export const getGroupMembers = async (req: Request, res: Response) => {
    const groupId = req.params.id;
    
    getTokenPayload(res,
        async (payload: DecodedIdToken) => {
            const userId = payload.uid;
            
            const members = await GroupsService.findGroupMembers(groupId, userId);
            res.status(Rest.STATUS_OK)
                .header(Rest.X_TOTAL_COUNT, members.count.toString(10))
                .json(members.entities);
        },
        () => {
            res.status(Rest.STATUS_UNAUTHORIZED).send();
        });
};

export const createGroup = async (req: Request<{}, Group, Group, {}>, res: Response) => {
    const group = req.body;
    
    getTokenPayload(res,
        async (payload: DecodedIdToken) => {
            
            const ownerId = payload.uid;
            const createdGroup = await GroupsService.create(group, ownerId);
            
            res.status(Rest.STATUS_CREATED)
                .header(Rest.LOCATION, "/v1/groups/" + createdGroup.id)
                .json(createdGroup);
        },
        () => {
            res.status(Rest.STATUS_UNAUTHORIZED).send();
        });
    
};

export const deleteGroup = async (req: Request, res: Response) => {
    const groupId = req.params.id;
    
    getTokenPayload(res,
        async (payload: DecodedIdToken) => {
            const ownerId = payload.uid;
            await GroupsService.delete(groupId, ownerId);
            res.status(Rest.STATUS_NO_CONTENT).send();
        },
        () => {
            res.status(Rest.STATUS_UNAUTHORIZED).send();
        });
};
