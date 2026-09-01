import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        items: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product",
                    required: true,
                },

                quantity: {
                    type: Number,
                    required: true,
                    min: 1,
                },

                price: {
                    type: Number,
                    required: true,
                    min: 0,
                },
            },
        ],

        totalAmount: {
            type: Number,
            required: true,
            min: 0,
        },

        paymentMethod: {
            type: String,
            enum: ["upi", "card", "cod"],
            required: true,
        },

        paymentStatus: {
            type: String,
            enum: [
                "pending",
                "paid",
                "failed",
                "refunded",
            ],
            default: "pending",
        },

        shippingAddress: {
            name: {
                type: String,
                required: true,
            },

            phone: {
                type: String,
                required: true,
            },

            address: {
                type: String,
                required: true,
            },

            city: {
                type: String,
                required: true,
            },

            state: {
                type: String,
                required: true,
            },

            pincode: {
                type: String,
                required: true,
            },
        },

        // =========================================
        // ORDER STATUS
        // =========================================

        status: {
            type: String,
            enum: [
                "pending",
                "confirmed",
                "shipped",
                "delivered",
                "cancellation_requested",
                "cancelled",
            ],
            default: "pending",
        },

        // =========================================
        // CANCELLATION
        // =========================================

        cancellationReason: {
            type: String,
            default: "",
            trim: true,
        },

        cancellationRequestedAt: {
            type: Date,
            default: null,
        },

        cancellationPreviousStatus: {
            type: String,
            enum: [
                "pending",
                "confirmed",
                null,
            ],
            default: null,
        },

        cancelledAt: {
            type: Date,
            default: null,
        },

        // =========================================
        // SHIPPING
        // =========================================

        courierName: {
            type: String,
            default: "",
            trim: true,
        },

        trackingNumber: {
            type: String,
            default: "",
            trim: true,
        },

        trackingUrl: {
            type: String,
            default: "",
            trim: true,
        },

        shippedAt: {
            type: Date,
            default: null,
        },

        deliveredAt: {
            type: Date,
            default: null,
        },

        // =========================================
        // REFUND
        // =========================================

        refundAmount: {
            type: Number,
            default: 0,
            min: 0,
        },

        refundStatus: {
            type: String,
            enum: [
                "not_applicable",
                "pending",
                "processed",
            ],
            default: "not_applicable",
        },

        refundId: {
            type: String,
            default: "",
            trim: true,
        },

        refundedAt: {
            type: Date,
            default: null,
        },
    },

    {
        timestamps: true,
    }
);

const Order =
    mongoose.models.Order ||
    mongoose.model("Order", orderSchema);

export default Order;