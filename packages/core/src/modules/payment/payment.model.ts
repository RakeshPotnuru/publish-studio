import mongoose, { Schema } from "mongoose";

import type { IPayment } from "./payment.types";

const PaymentSchema = new Schema<IPayment>(
    {
        user_id: { type: Schema.Types.ObjectId, required: true, unique: true },
        subscription_id: { type: String, required: true },
        isPaid: { type: Boolean, required: true },
        amount: { type: Number, required: true },
        currency: { type: String, required: true },
    },
    {
        timestamps: {
            createdAt: "created_at",
            updatedAt: "updated_at",
        },
    },
);

export default mongoose.model("Payment", PaymentSchema);
