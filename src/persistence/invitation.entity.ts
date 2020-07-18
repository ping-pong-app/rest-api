import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { GroupEntity } from "./group.entity";

@Entity("invitations")
export class InvitationEntity {
    
    @PrimaryGeneratedColumn("uuid")
    public id: string;
    
    @Column("varchar", {name: "user_id", nullable: false})
    public userId: string;
    
    @ManyToOne(
        () => GroupEntity,
        {onDelete: "CASCADE"}
    )
    @JoinColumn({name: "group_id"})
    public group: GroupEntity;
    
}
