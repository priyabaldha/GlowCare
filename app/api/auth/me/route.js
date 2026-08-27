import connectDB from "../../../../lib/db";
import User from "../../../../models/User";
import { getSessionUserId } from "../../../../lib/auth";

export async function GET() {
    try {
        const userId = await getSessionUserId();

        console.log("ME API - USER ID:", userId);

        if (!userId) {
            return Response.json({
                success: true,
                user: null,
            });
        }

        await connectDB();

        const user = await User.findById(userId)
            .select("_id name email role")
            .lean();

        console.log("ME API - USER:", user);

        if (!user) {
            return Response.json({
                success: true,
                user: null,
            });
        }

        return Response.json({
            success: true,
            user: {
                id: user._id.toString(),
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });

    } catch (error) {
        console.error(
            "ME API ERROR:",
            error
        );

        return Response.json(
            {
                success: false,
                user: null,
                message: "Unable to get current user.",
            },
            {
                status: 500,
            }
        );
    }
}