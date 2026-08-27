import bcrypt from "bcryptjs";
import connectDB from "../../../../lib/db";
import User from "../../../../models/User";

export async function POST(request) {
    try {
        await connectDB();

        const body = await request.json();

        const {
            name,
            email,
            password,
        } = body;

        // Basic validation
        if (!name || !email || !password) {
            return Response.json(
                {
                    success: false,
                    message: "Please fill in all fields.",
                },
                { status: 400 }
            );
        }

        if (password.length < 6) {
            return Response.json(
                {
                    success: false,
                    message:
                        "Password must be at least 6 characters.",
                },
                { status: 400 }
            );
        }

        // Normalize email
        const normalizedEmail =
            email.trim().toLowerCase();

        // Check existing user
        const existingUser = await User.findOne({
            email: normalizedEmail,
        });

        if (existingUser) {
            return Response.json(
                {
                    success: false,
                    message:
                        "An account with this email already exists.",
                },
                { status: 409 }
            );
        }

        // Hash password
        const hashedPassword =
            await bcrypt.hash(password, 12);

        // Create user
        const user = await User.create({
            name: name.trim(),
            email: normalizedEmail,
            password: hashedPassword,
        });

        return Response.json(
            {
                success: true,
                message:
                    "Account created successfully.",
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                },
            },
            { status: 201 }
        );

    } catch (error) {
        console.error(
            "Registration error:",
            error
        );

        return Response.json(
            {
                success: false,
                message:
                    "Something went wrong while creating your account.",
            },
            { status: 500 }
        );
    }
}