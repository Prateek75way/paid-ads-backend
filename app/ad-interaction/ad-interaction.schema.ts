import mongoose from "mongoose";
import { IAdInteraction } from "./ad-interaction.dto";
const adInteractionSchema = new mongoose.Schema({
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    adId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ad',
      required: true,
    },
    interactionType: {
      type: String,
      enum: ['view', 'click'],
      required: true,
    },
    ipAddress: { type: String, required: true }, // User's IP address
    timestamp: {
      type: Date,
      default: Date.now,
    },
  });
  
  export const AdInteraction = mongoose.model<IAdInteraction>('AdInteraction', adInteractionSchema);