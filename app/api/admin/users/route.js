import connectDB from "../../../../lib/db";
import User from "../../../../models/User";
import Order from "../../../../models/Order";
import { getSessionUserId } from "../../../../lib/auth";

export async function GET() {
    try {
        // =========================================
        // CHECK LOGIN
        // =========================================

        const userId = await getSessionUserId();

        if (!userId) {
            return Response.json(
                {
                    success: false,
                    message: "Please login first.",
                },
                { status: 401 }
            );
        }

        // =========================================
        // CONNECT DATABASE
        // =========================================

        await connectDB();

        // =========================================
        // CHECK ADMIN
        // =========================================

        const admin = await User.findById(userId)
            .select("role");

        if (!admin) {
            return Response.json(
                {
                    success: false,
                    message: "User not found.",
                },
                { status: 404 }
            );
        }

        if (admin.role !== "admin") {
            return Response.json(
                {
                    success: false,
                    message: "Access denied.",
                },
                { status: 403 }
            );
        }

        // =========================================
        // GET CUSTOMERS
        // =========================================

        const users = await User.find({
            role: "user",
        })
            .select("-password")
            .sort({ createdAt: -1 })
            .lean();

        // =========================================
        // GET ORDER STATISTICS
        // =========================================

        const orderStats = await Order.aggregate([
            {
                $match: {
                    status: {
                        $ne: "cancelled",
                    },
                },
            },
            {
                $group: {
                    _id: "$user",

                    orderCount: {
                        $sum: 1,
                    },

                    totalSpent: {
                        $sum: "$totalAmount",
                    },
                },
            },
        ]);

        // =========================================
        // MAP ORDER STATS
        // =========================================

        const statsMap = new Map();

        orderStats.forEach((stat) => {
            statsMap.set(
                stat._id?.toString(),
                {
                    orderCount: stat.orderCount || 0,
                    totalSpent: stat.totalSpent || 0,
                }
            );
        });

        // =========================================
        // ADD STATS TO USERS
        // =========================================

        const customers = users.map((user) => {
            const stats =
                statsMap.get(user._id.toString()) || {
                    orderCount: 0,
                    totalSpent: 0,
                };

            return {
                ...user,

                orderCount:
                    stats.orderCount,

                totalSpent:
                    stats.totalSpent,
            };
        });

        // =========================================
        // SUMMARY
        // =========================================

        const totalCustomers =
            customers.length;

        const totalOrders =
            customers.reduce(
                (total, customer) =>
                    total +
                    customer.orderCount,
                0
            );

        const totalSpent =
            customers.reduce(
                (total, customer) =>
                    total +
                    customer.totalSpent,
                0
            );

        // =========================================
        // RESPONSE
        // =========================================

        return Response.json({
            success: true,

            users: customers,

            summary: {
                totalCustomers,
                totalOrders,
                totalSpent,
            },
        });
    } catch (error) {
        console.error(
            "Admin users error:",
            error
        );

        return Response.json(
            {
                success: false,
                message:
                    "Failed to fetch customers.",
            },
            { status: 500 }
        );
    }
}