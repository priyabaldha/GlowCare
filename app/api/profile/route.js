import connectDB from "../../../lib/db";
import User from "../../../models/User";
import { getSessionUserId } from "../../../lib/auth";

// =========================================
// GET → CURRENT USER PROFILE
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

        const user =
            await User.findById(userId)
                .select(
                    "_id name email phone address"
                )
                .lean();

        if (!user) {
            return Response.json(
                {
                    success: false,
                    message:
                        "User not found.",
                },
                { status: 404 }
            );
        }

        return Response.json({
            success: true,
            user: {
                id: user._id.toString(),
                name: user.name,
                email: user.email,
                phone: user.phone || "",
                address: {
                    street:
                        user.address?.street ||
                        "",
                    city:
                        user.address?.city ||
                        "",
                    state:
                        user.address?.state ||
                        "",
                    pincode:
                        user.address?.pincode ||
                        "",
                },
            },
        });

    } catch (error) {
        console.error(
            "Get profile error:",
            error
        );

        return Response.json(
            {
                success: false,
                message:
                    "Failed to get profile.",
            },
            { status: 500 }
        );
    }
}


// =========================================
// PUT → UPDATE CURRENT USER PROFILE
// =========================================

export async function PUT(request) {
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

        const body =
            await request.json();

        const {
            name,
            phone,
            address,
        } = body;

        if (!name?.trim()) {
            return Response.json(
                {
                    success: false,
                    message:
                        "Name is required.",
                },
                { status: 400 }
            );
        }

        await connectDB();

        const user =
            await User.findById(userId);

        if (!user) {
            return Response.json(
                {
                    success: false,
                    message:
                        "User not found.",
                },
                { status: 404 }
            );
        }

        user.name = name.trim();

        user.phone =
            phone?.trim() || "";

        user.address = {
            street:
                address?.street?.trim() || "",
            city:
                address?.city?.trim() || "",
            state:
                address?.state?.trim() || "",
            pincode:
                address?.pincode?.trim() || "",
        };

        await user.save();

        return Response.json({
            success: true,
            message:
                "Profile updated successfully.",
            user: {
                id: user._id.toString(),
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
            },
        });

    } catch (error) {
        console.error(
            "Update profile error:",
            error
        );

        return Response.json(
            {
                success: false,
                message:
                    "Failed to update profile.",
            },
            { status: 500 }
        );
    }
}