import connectDB from "../../../../../lib/db";
import Order from "../../../../../models/Order";
import User from "../../../../../models/User";
import Product from "../../../../../models/Product";
import { getSessionUserId } from "../../../../../lib/auth";

// =========================================
// PATCH → UPDATE ORDER
// =========================================

export async function PATCH(
    request,
    { params }
) {
    try {
        const { id } = await params;

        const userId =
            await getSessionUserId();

        if (!userId) {
            return Response.json(
                {
                    success: false,
                    message:
                        "Please login first.",
                },
                { status: 401 }
            );
        }

        await connectDB();

        // =========================================
        // CHECK ADMIN
        // =========================================

        const admin =
            await User.findById(
                userId
            ).select("role");

        if (!admin) {
            return Response.json(
                {
                    success: false,
                    message:
                        "User not found.",
                },
                { status: 404 }
            );
        }

        if (
            admin.role !== "admin"
        ) {
            return Response.json(
                {
                    success: false,
                    message:
                        "Access denied.",
                },
                { status: 403 }
            );
        }

        // =========================================
        // REQUEST BODY
        // =========================================

        const body =
            await request.json();

        const {
            status,
            courierName,
            trackingNumber,
            trackingUrl,
            action,
        } = body;

        // =========================================
        // FIND ORDER
        // =========================================

        const order =
            await Order.findById(id);

        if (!order) {
            return Response.json(
                {
                    success: false,
                    message:
                        "Order not found.",
                },
                { status: 404 }
            );
        }

        // =========================================
        // ADMIN REJECT CANCELLATION
        // =========================================

        if (
            action ===
            "reject_cancellation"
        ) {
            if (
                order.status !==
                "cancellation_requested"
            ) {
                return Response.json(
                    {
                        success: false,
                        message:
                            "There is no cancellation request for this order.",
                    },
                    { status: 400 }
                );
            }

            const previousStatus =
                order.cancellationPreviousStatus ||
                "pending";

            order.status =
                previousStatus;

            order.cancellationRequestedAt =
                null;

            order.cancellationReason =
                "";

            order.cancellationPreviousStatus =
                null;

            await order.save();

            await order.populate([
                {
                    path: "user",
                    select:
                        "name email",
                },
                {
                    path: "items.product",
                    select:
                        "name image price",
                },
            ]);

            return Response.json({
                success: true,
                message:
                    "Cancellation request rejected.",
                order,
            });
        }

        // =========================================
        // ADMIN PROCESS REFUND
        // =========================================

        if (
            action ===
            "process_refund"
        ) {
            if (
                order.status !==
                "cancelled"
            ) {
                return Response.json(
                    {
                        success: false,
                        message:
                            "Only cancelled orders can be refunded.",
                    },
                    { status: 400 }
                );
            }

            if (
                order.refundStatus !==
                "pending"
            ) {
                return Response.json(
                    {
                        success: false,
                        message:
                            "This order does not have a pending refund.",
                    },
                    { status: 400 }
                );
            }

            order.refundStatus =
                "processed";

            order.paymentStatus =
                "refunded";

            order.refundAmount =
                order.totalAmount;

            order.refundId =
                `DEMO-REFUND-${Date.now()}`;

            order.refundedAt =
                new Date();

            await order.save();

            await order.populate([
                {
                    path: "user",
                    select:
                        "name email",
                },
                {
                    path: "items.product",
                    select:
                        "name image price",
                },
            ]);

            return Response.json({
                success: true,
                message:
                    "Demo refund processed successfully.",
                order,
            });
        }

        // =========================================
        // STATUS REQUIRED
        // =========================================

        if (!status) {
            return Response.json(
                {
                    success: false,
                    message:
                        "Order status is required.",
                },
                { status: 400 }
            );
        }

        // =========================================
        // VALID STATUSES
        // =========================================

        const allowedStatuses = [
            "pending",
            "confirmed",
            "shipped",
            "delivered",
            "cancellation_requested",
            "cancelled",
        ];

        if (
            !allowedStatuses.includes(
                status
            )
        ) {
            return Response.json(
                {
                    success: false,
                    message:
                        "Invalid order status.",
                },
                { status: 400 }
            );
        }

        const currentStatus =
            order.status;

        // =========================================
        // SAME STATUS
        // =========================================

        if (
            currentStatus ===
            status
        ) {
            return Response.json(
                {
                    success: false,
                    message:
                        `Order is already ${status}.`,
                },
                { status: 400 }
            );
        }

        // =========================================
        // FINAL STATES
        // =========================================

        if (
            currentStatus ===
            "delivered"
        ) {
            return Response.json(
                {
                    success: false,
                    message:
                        "Delivered orders cannot be changed.",
                },
                { status: 400 }
            );
        }

        if (
            currentStatus ===
            "cancelled"
        ) {
            return Response.json(
                {
                    success: false,
                    message:
                        "Cancelled orders cannot be changed.",
                },
                { status: 400 }
            );
        }

        // =========================================
        // VALID STATUS FLOW
        // =========================================

        const validTransitions = {
            pending: [
                "confirmed",
                "cancellation_requested",
                "cancelled",
            ],

            confirmed: [
                "shipped",
                "cancellation_requested",
                "cancelled",
            ],

            shipped: [
                "delivered",
            ],

            cancellation_requested: [
                "cancelled",
            ],

            delivered: [],

            cancelled: [],
        };

        if (
            !validTransitions[
                currentStatus
            ]?.includes(status)
        ) {
            return Response.json(
                {
                    success: false,
                    message:
                        `Cannot change order from ${currentStatus} to ${status}.`,
                },
                { status: 400 }
            );
        }

        // =========================================
        // SHIPPING
        // =========================================

        if (
            status ===
            "shipped"
        ) {
            if (
                !courierName?.trim()
            ) {
                return Response.json(
                    {
                        success: false,
                        message:
                            "Courier name is required.",
                    },
                    { status: 400 }
                );
            }

            if (
                !trackingNumber?.trim()
            ) {
                return Response.json(
                    {
                        success: false,
                        message:
                            "Tracking number is required.",
                    },
                    { status: 400 }
                );
            }

            order.courierName =
                courierName.trim();

            order.trackingNumber =
                trackingNumber.trim();

            order.trackingUrl =
                trackingUrl?.trim() ||
                "";

            order.shippedAt =
                new Date();
        }

        // =========================================
        // DELIVERED
        // =========================================

        if (
            status ===
            "delivered"
        ) {
            order.deliveredAt =
                new Date();
        }

        // =========================================
        // CANCELLATION REQUEST
        // =========================================

        if (
            status ===
            "cancellation_requested"
        ) {
            order.cancellationPreviousStatus =
                currentStatus;

            order.cancellationRequestedAt =
                new Date();
        }

        // =========================================
        // ADMIN CANCELS / APPROVES
        // =========================================

        if (
            status ===
            "cancelled"
        ) {
            // Return stock
            for (
                const item of order.items
            ) {
                await Product.findByIdAndUpdate(
                    item.product,
                    {
                        $inc: {
                            stock:
                                item.quantity,
                        },
                    }
                );
            }

            order.cancelledAt =
                new Date();

            // =====================================
            // REFUND
            // =====================================

            if (
                order.paymentMethod !==
                "cod" &&
                order.paymentStatus ===
                "paid"
            ) {
                order.refundAmount =
                    order.totalAmount;

                order.refundStatus =
                    "pending";
            } else {
                order.refundAmount =
                    0;

                order.refundStatus =
                    "not_applicable";
            }

            order.cancellationPreviousStatus =
                null;
        }

        // =========================================
        // SAVE
        // =========================================

        order.status =
            status;

        await order.save();

        await order.populate([
            {
                path: "user",
                select:
                    "name email",
            },
            {
                path: "items.product",
                select:
                    "name image price",
            },
        ]);

        return Response.json({
            success: true,
            message:
                "Order updated successfully.",
            order,
        });

    } catch (error) {
        console.error(
            "Admin order update error:",
            error
        );

        return Response.json(
            {
                success: false,
                message:
                    error?.message ||
                    "Failed to update order.",
            },
            { status: 500 }
        );
    }
}