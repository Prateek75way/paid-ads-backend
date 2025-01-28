import { BaseSchema } from "../common/dto/base.dto";

export interface IAd {
  title: string;
  description: string;
  imageUrl: string;
  pricePerView: number;
  pricePerClick: number;
  createdBy?: string; // Reference to the User ID
  redirectUrl?: string;
}