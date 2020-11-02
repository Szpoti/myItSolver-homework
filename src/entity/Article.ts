const { Entity, PrimaryGeneratedColumn, Column } = require("typeorm");

@Entity({ name: "articles" })
export class Article {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;
  
  @Column()
  imageUrl: string;
}
