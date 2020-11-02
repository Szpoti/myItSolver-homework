const { Entity, PrimaryGeneratedColumn, Column } = require("typeorm");

@Entity({ name: "requesters" })
export class Requester {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    token: string;

    @Column()
    remainings: number;
}