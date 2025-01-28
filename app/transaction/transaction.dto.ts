import { BaseSchema } from "../common/dto/base.dto";

export interface ITransaction extends BaseSchema {
  userId: string; // Reference to the User ID
  amount: number;
  type: "credit" | "debit"; // Type of transaction
  description: string; // Description of the transaction
}