import connectDB from "../../../lib/db";
import Wishlist from "../../../models/Wishlist";
import { getSessionUserId } from "../../../lib/auth";

// GET → get wishlist
export async function GET() {
    try {
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

        await connectDB();

        const wishlist = await Wishlist.findOne({
            user: userId,
        }).populate("products");

        return Response.json({
            success: true,
            wishlist: wishlist || {
                products: [],
            },
        });

    } catch (error) {
        console.error(
            "Get wishlist error:",
            error
        );

        return Response.json(
            {
                success: false,
                message: "Failed to get wishlist.",
            },
            { status: 500 }
        );
    }
}


// POST → add product to wishlist
export async function POST(request) {
    try {
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

        const { productId } =
            await request.json();

        if (!productId) {
            return Response.json(
                {
                    success: false,
                    message: "Product ID is required.",
                },
                { status: 400 }
            );
        }

        await connectDB();

        let wishlist = await Wishlist.findOne({
            user: userId,
        });

        // Create wishlist if it doesn't exist
        if (!wishlist) {
            wishlist = await Wishlist.create({
                user: userId,
                products: [productId],
            });

            return Response.json({
                success: true,
                message: "Added to wishlist.",
                wishlist,
            });
        }

        // Check if product already exists
        const alreadyExists =
            wishlist.products.some(
                (id) =>
                    id.toString() ===
                    productId.toString()
            );

        if (!alreadyExists) {
            wishlist.products.push(productId);
            await wishlist.save();
        }

        return Response.json({
            success: true,
            message: alreadyExists
                ? "Already in wishlist."
                : "Added to wishlist.",
            wishlist,
        });

    } catch (error) {
        console.error(
            "Add wishlist error:",
            error
        );

        return Response.json(
            {
                success: false,
                message: "Failed to add wishlist item.",
            },
            { status: 500 }
        );
    }
}


// DELETE → remove product from wishlist
export async function DELETE(request) {
    try {
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

        const { productId } =
            await request.json();

        if (!productId) {
            return Response.json(
                {
                    success: false,
                    message: "Product ID is required.",
                },
                { status: 400 }
            );
        }

        await connectDB();

        const wishlist = await Wishlist.findOne({
            user: userId,
        });

        if (!wishlist) {
            return Response.json({
                success: true,
                message: "Wishlist is empty.",
            });
        }

        wishlist.products =
            wishlist.products.filter(
                (id) =>
                    id.toString() !==
                    productId.toString()
            );

        await wishlist.save();

        return Response.json({
            success: true,
            message: "Removed from wishlist.",
            wishlist,
        });

    } catch (error) {
        console.error(
            "Remove wishlist error:",
            error
        );

        return Response.json(
            {
                success: false,
                message: "Failed to remove wishlist item.",
            },
            { status: 500 }
        );
    }
}