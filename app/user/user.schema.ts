
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { IUser } from './user.dto';

const hashPassword = async (password: string) => {
        const hash = await bcrypt.hash(password, 12);
        return hash;
    };

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  refreshToken: {
    type: String,
  },
  role: { type: String, enum: ["USER", "ADMIN"], default: "USER" },
  active: {
    type: Boolean,
    default: true,
  },
  walletBalance: {
    type: Number,
    default: 0,
  },
  ipAddress: {
    type: String,
    required: true,
//     unique: true, // Ensure each user has a unique IP address
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt:{
    type: Date,
    default: Date.now
  }
});



UserSchema.pre("save", async function (next) {
        if (!this.isModified("password")) {
            return next();
        }
        this.password = await hashPassword(this.password);
        next();
    });

export default mongoose.model<IUser>("user", UserSchema);
