import { User } from './user.model';

export interface Message {
  createdAt?: Date;
  updatedAt?: Date;
  _id?: string;
  receiver?: User;
  sender: User;
  roomId: string;
  message: string;
}
