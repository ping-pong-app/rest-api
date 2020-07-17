import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { GroupEntity } from "./group.entity";

@Entity("group_members")
export class GroupMemberEntity {
    
    @PrimaryColumn("varchar", {name: "user_id", nullable: false})
    public userId: string;
    
    @PrimaryColumn("uuid", {name: "group_id"})
    @ManyToOne(
        () => GroupEntity,
        group => group.members,
    )
    @JoinColumn({name: "group_id", referencedColumnName: ""})
    public group?: GroupEntity;
    
}
