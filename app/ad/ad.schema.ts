import mongoose from "mongoose";
import { IAd } from "./ad.dto";
import users from "../user/user.schema";
const adSchema = new mongoose.Schema({
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    pricePerView: {
      type: Number,
      required: true,
    },
    pricePerClick: {
      type: Number,
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    redirectUrl: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  });
  
  export const Ad = mongoose.model<IAd>('Ad', adSchema);