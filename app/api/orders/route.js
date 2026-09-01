import connectDB from "../../../lib/db";
import Order from "../../../models/Order";
import Cart from "../../../models/Cart";
import Product from "../../../models/Product";
import { getSessionUserId } from "../../../lib/auth";

// =========================================
// POST → CREATE ORDER FROM CART
// =========================================

export async function POST(request) {
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

        const {
            shippingAddress,
            paymentMethod,
        } = await request.json();

        // =========================================
        // VALIDATE SHIPPING ADDRESS
        // =========================================

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

        // =========================================
        // VALIDATE PAYMENT METHOD
        // =========================================

        if (
            ![
                "upi",
                "card",
                "cod",
            ].includes(paymentMethod)
        ) {
            return Response.json(
                {
                    success: false,
                    message:
                        "Invalid payment method.",
                },
                { status: 400 }
            );
        }

        await connectDB();

        // =========================================
        // GET CART
        // =========================================

        const cart =
            await Cart.findOne({
                user: userId,
            }).populate(
                "items.product"
            );

        if (
            !cart ||
            cart.items.length === 0
        ) {
            return Response.json(
                {
                    success: false,
                    message:
                        "Your cart is empty.",
                },
                { status: 400 }
            );
        }

        // =========================================
        // CHECK STOCK
        // =========================================

        for (
            const item of cart.items
        ) {
            if (!item.product) {
                return Response.json(
                    {
                        success: false,
                        message:
                            "One of the products in your cart no longer exists.",
                    },
                    { status: 400 }
                );
            }

            if (
                item.quantity >
                item.product.stock
            ) {
                return Response.json(
                    {
                        success: false,
                        message:
                            `${item.product.name} has only ${item.product.stock} item(s) left in stock.`,
                    },
                    { status: 400 }
                );
            }
        }

        // =========================================
        // CREATE ORDER ITEMS
        // =========================================

        const orderItems =
            cart.items.map(
                (item) => ({
                    product:
                        item.product._id,

                    quantity:
                        item.quantity,

                    price:
                        item.product.price,
                })
            );

        // =========================================
        // CALCULATE TOTAL
        // =========================================

        const totalAmount =
            cart.items.reduce(
                (
                    total,
                    item
                ) =>
                    total +
                    item.product.price *
                        item.quantity,
                0
            );

        // =========================================
        // CREATE ORDER
        // =========================================

        const order =
            await Order.create({
                user: userId,

                items:
                    orderItems,

                totalAmount,

                shippingAddress,

                paymentMethod,

                paymentStatus:
                    paymentMethod ===
                    "cod"
                        ? "pending"
                        : "paid",

                status:
                    "pending",

                refundStatus:
                    "not_applicable",

                refundAmount: 0,
            });

        // =========================================
        // DECREASE STOCK
        // =========================================

        for (
            const item of cart.items
        ) {
            const updatedProduct =
                await Product.findOneAndUpdate(
                    {
                        _id:
                            item.product._id,

                        stock: {
                            $gte:
                                item.quantity,
                        },
                    },
                    {
                        $inc: {
                            stock:
                                -item.quantity,
                        },
                    },
                    {
                        new: true,
                    }
                );

            if (!updatedProduct) {
                console.error(
                    "Stock update failed:",
                    item.product._id
                );

                // Demo project:
                // remove created order
                await Order.findByIdAndDelete(
                    order._id
                );

                return Response.json(
                    {
                        success: false,
                        message:
                            `Unable to update stock for ${item.product.name}.`,
                    },
                    { status: 400 }
                );
            }
        }

        // =========================================
        // EMPTY CART
        // =========================================

        cart.items = [];

        await cart.save();

        return Response.json(
            {
                success: true,

                message:
                    "Order placed successfully.",

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

                message:
                    "Failed to place order.",
            },

            { status: 500 }
        );
    }
}


// =========================================
// GET → GET USER'S ORDERS
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

        const orders =
            await Order.find({
                user: userId,
            })
                .populate(
                    "items.product"
                )
                .sort({
                    createdAt: -1,
                });

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

                message:
                    "Failed to get orders.",
            },

            { status: 500 }
        );
    }
}