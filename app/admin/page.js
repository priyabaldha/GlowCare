import { redirect } from "next/navigation";

import connectDB from "../../lib/db";
import User from "../../models/User";
import { getSessionUserId } from "../../lib/auth";

import AdminDashboard from "./AdminDashboard";

export default async function AdminPage() {
    // Get logged-in user's ID
    const userId =
        await getSessionUserId();

    // Not logged in
    if (!userId) {
        redirect("/login");
    }

    // Connect to MongoDB
    await connectDB();

    // Find the user
    const user = await User.findById(
        userId
    ).select("role");

    // User doesn't exist
    if (!user) {
        redirect("/login");
    }

    // User is not admin
    if (user.role !== "admin") {
        redirect("/");
    }

    // User is admin
    return <AdminDashboard />;
}