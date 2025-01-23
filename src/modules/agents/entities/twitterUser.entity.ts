import { BaseEntity } from 'src/utils/base/base-entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class TwitterUser extends BaseEntity {
  @Column({nullable: true})
  address: string;

  @Column({ unique: true })
  userId: string;

  @Column()
  screenName: string;

  @Column()
  accessToken: string;

  @Column()
  accessSecret: string;

  @Column()
  username: string;
}
