import {
  AfterInsert,
  AfterUpdate,
  AfterRemove,
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';
import { Report } from '../reports/report.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ default: true })
  admin: boolean;
  //1 User has (many) reports so we made an array
  // second argument if we want to divide the roles like: if we want before publishing the report an approval from the owner and the approver
  @OneToMany(() => Report, (report) => report.user)
  reports: Report[];

  @AfterInsert()
  logInsert() {
    console.log(`Inserted User with ID: ${this.id} & Email: ${this.email}`);
  }

  @AfterUpdate()
  logUpdate() {
    console.log(`Updated User with ID: ${this.id}`);
  }

  @AfterRemove()
  logRemove() {
    console.log(`Removed User`);
  }
}
