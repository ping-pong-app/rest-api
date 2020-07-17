import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { GroupMemberEntity } from "./group-member.entity";

@Entity("groups")
export class GroupEntity {
    
    @PrimaryGeneratedColumn("uuid")
    public id?: string;
    
    @Column({nullable: false})
    public name: string;
    
    @Column("varchar", {name: "owner_id", nullable: false})
    public ownerId: string;
    
    @CreateDateColumn({name: "created_at"})
    public createdAt: Date;
    
    @UpdateDateColumn({name: "updated_at"})
    public updatedAt: Date;
    
    @OneToMany(
        () => GroupMemberEntity,
        member => member.group,
        {eager: true}
    )
    public members: GroupMemberEntity[];
    
}
