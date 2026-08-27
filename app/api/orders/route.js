import connectDB from "../../../lib/db";
import Order from "../../../models/Order";
import Cart from "../../../models/Cart";
import { getSessionUserId } from "../../../lib/auth";

// POST → create order from cart
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

        const {
            shippingAddress,
            paymentMethod,
        } = await request.json();

        if (
            !shippingAddress?.name ||
            !shippingAddress?.phone ||
            !shippingAddress?.address ||
            !shippingAddress?.city ||
            !shippingAddress?.state ||
            !shippingAddress?.pincode
        ) {
            return Response.json(
                {
                    success: false,
                    message:
                        "Please provide complete delivery details.",
                },
                { status: 400 }
            );
        }

        if (
            !["upi", "card", "cod"].includes(
                paymentMethod
            )
        ) {
            return Response.json(
                {
                    success: false,
                    message: "Invalid payment method.",
                },
                { status: 400 }
            );
        }

        await connectDB();

        const cart = await Cart.findOne({
            user: userId,
        }).populate("items.product");

        if (!cart || cart.items.length === 0) {
            return Response.json(
                {
                    success: false,
                    message: "Your cart is empty.",
                },
                { status: 400 }
            );
        }

        const orderItems = cart.items.map(
            (item) => ({
                product: item.product._id,
                quantity: item.quantity,
                price: item.product.price,
            })
        );

        const totalAmount = cart.items.reduce(
            (total, item) =>
                total +
                item.product.price *
                item.quantity,
            0
        );

        const order = await Order.create({
            user: userId,
            items: orderItems,
            totalAmount,

            shippingAddress,

            paymentMethod,

            paymentStatus:
                paymentMethod === "cod"
                    ? "pending"
                    : "paid",
        });

        // Empty cart after successful order
        cart.items = [];
        await cart.save();

        return Response.json(
            {
                success: true,
                message: "Order placed successfully.",
                order,
            },
            { status: 201 }
        );

    } catch (error) {
        console.error(
            "Create order error:",
            error
        );

        return Response.json(
            {
                success: false,
                message: "Failed to place order.",
            },
            { status: 500 }
        );
    }
}


// GET → get user's orders
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

        const orders = await Order.find({
            user: userId,
        })
            .populate("items.product")
            .sort({ createdAt: -1 });

        return Response.json({
            success: true,
            orders,
        });

    } catch (error) {
        console.error(
            "Get orders error:",
            error
        );

        return Response.json(
            {
                success: false,
                message: "Failed to get orders.",
            },
            { status: 500 }
        );
    }
}