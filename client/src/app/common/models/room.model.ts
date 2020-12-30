import { User } from './user.model';

export interface Room {
  createdAt?: Date;
  updatedAt?: Date;
  _id: string;
  users: User[];
  friendChat?: User;
}
