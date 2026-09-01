import connectDB from "../../../../lib/db";
import User from "../../../../models/User";
import Order from "../../../../models/Order";
import { getSessionUserId } from "../../../../lib/auth";


// =========================================
// GET → ALL USERS FOR ADMIN
// =========================================

export async function GET() {
    try {
        const adminId =
            await getSessionUserId();

        if (!adminId) {
            return Response.json(
                {
                    success: false,
                    message: "Please login first.",
                },
                { status: 401 }
            );
        }

        await connectDB();

        // =========================================
        // CHECK ADMIN
        // =========================================

        const admin =
            await User.findById(adminId)
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
        // GET USERS
        // =========================================

        const users =
            await User.find()
                .select(
                    "-password"
                )
                .sort({
                    createdAt: -1,
                })
                .lean();

        // =========================================
        // GET ORDER INFORMATION
        // =========================================

        const orderStats =
            await Order.aggregate([
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
        // ADD ORDER DATA TO USERS
        // =========================================

        const statsMap =
            new Map(
                orderStats.map(
                    (stat) => [
                        stat._id.toString(),
                        {
                            orderCount:
                                stat.orderCount,

                            totalSpent:
                                stat.totalSpent,
                        },
                    ]
                )
            );

        const usersWithStats =
            users.map((user) => {
                const stats =
                    statsMap.get(
                        user._id.toString()
                    );

                return {
                    ...user,

                    orderCount:
                        stats?.orderCount || 0,

                    totalSpent:
                        stats?.totalSpent || 0,
                };
            });

        // =========================================
        // SUMMARY
        // =========================================

        const totalUsers =
            users.filter(
                (user) =>
                    user.role === "user"
            ).length;

        const totalAdmins =
            users.filter(
                (user) =>
                    user.role === "admin"
            ).length;

        return Response.json({
            success: true,

            users: usersWithStats,

            summary: {
                totalUsers,
                totalAdmins,
                totalAccounts:
                    users.length,
            },
        });

    } catch (error) {
        console.error(
            "Admin get users error:",
            error
        );

        return Response.json(
            {
                success: false,
                message:
                    "Failed to get users.",
            },
            { status: 500 }
        );
    }
}