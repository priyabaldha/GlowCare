import connectDB from "../../../lib/db";
import Cart from "../../../models/Cart";
import { getSessionUserId } from "../../../lib/auth";

// GET → get current user's cart
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

        const cart = await Cart.findOne({
            user: userId,
        }).populate("items.product");

        return Response.json({
            success: true,
            cart: cart || {
                items: [],
            },
        });

    } catch (error) {
        console.error(
            "Get cart error:",
            error
        );

        return Response.json(
            {
                success: false,
                message: "Failed to get cart.",
            },
            { status: 500 }
        );
    }
}


// POST → add product to cart
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

        const { productId, quantity = 1 } =
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

        let cart = await Cart.findOne({
            user: userId,
        });

        // No cart yet → create one
        if (!cart) {
            cart = await Cart.create({
                user: userId,
                items: [
                    {
                        product: productId,
                        quantity,
                    },
                ],
            });

            return Response.json({
                success: true,
                message: "Product added to cart.",
                cart,
            });
        }

        // Check whether product already exists
        const existingItem = cart.items.find(
            (item) =>
                item.product.toString() ===
                productId.toString()
        );

        if (existingItem) {
            // Product already exists → increase quantity
            existingItem.quantity += quantity;
        } else {
            // New product → add to cart
            cart.items.push({
                product: productId,
                quantity,
            });
        }

        await cart.save();

        return Response.json({
            success: true,
            message: "Product added to cart.",
            cart,
        });

    } catch (error) {
        console.error(
            "Add to cart error:",
            error
        );

        return Response.json(
            {
                success: false,
                message: "Failed to add product to cart.",
            },
            { status: 500 }
        );
    }
}


// PUT → update product quantity
export async function PUT(request) {
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

        const { productId, quantity } =
            await request.json();

        if (!productId || quantity < 1) {
            return Response.json(
                {
                    success: false,
                    message: "Invalid product or quantity.",
                },
                { status: 400 }
            );
        }

        await connectDB();

        const cart = await Cart.findOne({
            user: userId,
        });

        if (!cart) {
            return Response.json(
                {
                    success: false,
                    message: "Cart not found.",
                },
                { status: 404 }
            );
        }

        const item = cart.items.find(
            (item) =>
                item.product.toString() ===
                productId.toString()
        );

        if (!item) {
            return Response.json(
                {
                    success: false,
                    message: "Product not found in cart.",
                },
                { status: 404 }
            );
        }

        item.quantity = quantity;

        await cart.save();

        return Response.json({
            success: true,
            message: "Quantity updated.",
            cart,
        });

    } catch (error) {
        console.error(
            "Update cart error:",
            error
        );

        return Response.json(
            {
                success: false,
                message: "Failed to update cart.",
            },
            { status: 500 }
        );
    }
}


// DELETE → remove product from cart
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

        const cart = await Cart.findOne({
            user: userId,
        });

        if (!cart) {
            return Response.json(
                {
                    success: false,
                    message: "Cart not found.",
                },
                { status: 404 }
            );
        }

        cart.items = cart.items.filter(
            (item) =>
                item.product.toString() !==
                productId.toString()
        );

        await cart.save();

        return Response.json({
            success: true,
            message: "Product removed from cart.",
            cart,
        });

    } catch (error) {
        console.error(
            "Remove cart item error:",
            error
        );

        return Response.json(
            {
                success: false,
                message: "Failed to remove product.",
            },
            { status: 500 }
        );
    }
}