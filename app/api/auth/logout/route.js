import { deleteSession } from "../../../../lib/auth";

export async function POST() {
    try {
        await deleteSession();

        return Response.json(
            {
                success: true,
                message: "Logged out successfully.",
            },
            {
                status: 200,
            }
        );

    } catch (error) {
        console.error(
            "Logout error:",
            error
        );

        return Response.json(
            {
                success: false,
                message: "Logout failed.",
            },
            {
                status: 500,
            }
        );
    }
}