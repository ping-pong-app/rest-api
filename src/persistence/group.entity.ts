import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("groups")
export class GroupEntity {
    
    @PrimaryGeneratedColumn("uuid")
    public id?: string;
    
    @Column({nullable: false})
    public name: string;
    
    @Column("varchar", {name: "owner_id", nullable: false})
    public ownerId: string;
    
}
