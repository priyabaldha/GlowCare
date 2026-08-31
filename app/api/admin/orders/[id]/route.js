import connectDB from "../../../../../lib/db";
import Order from "../../../../../models/Order";
import User from "../../../../../models/User";
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

        // Check admin
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

        if (admin.role !== "admin") {
            return Response.json(
                {
                    success: false,
                    message:
                        "Access denied.",
                },
                { status: 403 }
            );
        }

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

        const order =
            await Order.findByIdAndUpdate(
                id,
                {
                    status,
                },
                {
                    new: true,
                }
            )
                .populate(
                    "user",
                    "name email"
                )
                .populate(
                    "items.product",
                    "name image price"
                );

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