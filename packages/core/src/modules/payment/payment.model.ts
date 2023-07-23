import type { Types } from "mongoose";
import mongoose, { Schema } from "mongoose";

interface IPayment {
    user_id: Types.ObjectId;
    payment_id: string;
    intent_id: string;
    isPaid: boolean;
    amount: number;
}

const PaymentSchema = new Schema<IPayment>(
    {
        user_id: { type: Schema.Types.ObjectId, required: true },
        payment_id: { type: String, required: true },
        intent_id: { type: String, required: true },
        isPaid: { type: Boolean, required: true },
        amount: { type: Number, required: true },
    },
    {
        timestamps: {
            createdAt: "created_at",
            updatedAt: "updated_at",
        },
    },
);

export default mongoose.model("Payment", PaymentSchema);
