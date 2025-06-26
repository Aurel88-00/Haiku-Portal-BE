import { Roles } from '../enums/roles.enum';

export interface IUser {
  readonly username: string;
  readonly email: string;
  readonly password: string;
  readonly role: Roles;
}
