import connectDB from "../../../../lib/db";
import Order from "../../../../models/Order";
import User from "../../../../models/User";
import { getSessionUserId } from "../../../../lib/auth";


// =========================================
// GET → ALL ORDERS FOR ADMIN
// =========================================

export async function GET() {
    try {
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

        // Check logged-in user
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

        // Only admin can access
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

        // Get all orders
        const orders =
            await Order.find()
                .populate(
                    "user",
                    "name email"
                )
                .populate(
                    "items.product",
                    "name image price"
                )
                .sort({
                    createdAt: -1,
                });

        return Response.json({
            success: true,
            orders,
        });

    } catch (error) {
        console.error(
            "Admin get orders error:",
            error
        );

        return Response.json(
            {
                success: false,
                message:
                    "Failed to get orders.",
            },
            { status: 500 }
        );
    }
}