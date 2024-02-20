import mongoose, { Schema } from "mongoose";

import type { IInvite } from "./invite.types";

const InviteSchema = new Schema<IInvite>(
  {
    email: { type: String, required: true },
    is_invited: { type: Boolean, default: false },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

export default mongoose.model("Invite", InviteSchema);
