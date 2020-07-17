import { GroupMember } from "./group-member.model";

export class Group {
    public id?: string;
    public name: string;
    public ownerId: string;
    public createdAt: Date;
    public updatedAt: Date;
    public members: GroupMember[];
}
