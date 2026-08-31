import connectDB from "../../../../../lib/db";
import Order from "../../../../../models/Order";
import User from "../../../../../models/User";
import Product from "../../../../../models/Product";
import { getSessionUserId } from "../../../../../lib/auth";

// =========================================
// PATCH → UPDATE ORDER STATUS
// =========================================

export async function PATCH(
    request,
    { params }
) {
    try {
        // Next.js 16
        const { id } =
            await params;

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
        // GET NEW STATUS
        // =========================================

        const { status } =
            await request.json();

        const allowedStatuses = [
            "pending",
            "confirmed",
            "shipped",
            "delivered",
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

        const currentStatus =
            order.status;

        // =========================================
        // PREVENT CHANGING SAME STATUS
        // =========================================

        if (
            currentStatus === status
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
        // PREVENT CHANGES AFTER CANCELLED
        // =========================================

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
        // PREVENT CHANGES AFTER DELIVERED
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

        // =========================================
        // VALID STATUS FLOW
        // =========================================

        const validTransitions = {
            pending: [
                "confirmed",
                "cancelled",
            ],

            confirmed: [
                "shipped",
                "cancelled",
            ],

            shipped: [
                "delivered",
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
        // CANCEL ORDER
        // RETURN STOCK
        // =========================================

        if (
            status ===
                "cancelled" &&
            currentStatus !==
                "cancelled"
        ) {
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
        }

        // =========================================
        // UPDATE STATUS
        // =========================================

        order.status =
            status;

        await order.save();

        // =========================================
        // POPULATE UPDATED ORDER
        // =========================================

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
                "Order status updated successfully.",
            order,
        });

    } catch (error) {
        console.error(
            "Admin update order error:",
            error
        );

        return Response.json(
            {
                success: false,
                message:
                    "Failed to update order.",
            },
            { status: 500 }
        );
    }
}