export interface User {
  email?: string;
  username: string;
  password?: string;
  createdAt?: Date;
  updatedAt?: Date;
  _id: string;
  followers?: User[] | string[];
  following?: User[] | string[];
  avatar?: string;
  background?: string;
}
