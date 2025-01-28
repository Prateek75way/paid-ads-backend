import { BaseSchema } from "../common/dto/base.dto";

export interface IAdInteraction extends BaseSchema {
  userId: string; // Reference to the User ID
  adId: string; // Reference to the Ad ID
  interactionType: "view" | "click"; // Type of interaction
}