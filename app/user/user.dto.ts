import { BaseSchema } from "../common/dto/base.dto";

export interface IUser extends BaseSchema {
  
  name: string;
  email: string;
  password: string;
  walletBalance: number;
  ipAddress: string;
  refreshToken?: string;
  active?: boolean;
  role: "USER" | "ADMIN";
}