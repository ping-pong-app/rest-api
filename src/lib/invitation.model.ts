import { Group } from "./groups.model";
import { User } from "./user.model";

export class Invitation {
    public id?: string;
    public userId?: string;
    public email?: string;
    public groupId: string;
}

export class ExtendedInvitation extends Invitation {
    public group: Group;
    public user: User;
}
