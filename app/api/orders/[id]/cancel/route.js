import connectDB from "../../../../../lib/db";
import Order from "../../../../../models/Order";
import { getSessionUserId } from "../../../../../lib/auth";


// =========================================
// POST → REQUEST ORDER CANCELLATION
// =========================================

export async function POST(
    request,
    { params }
) {
    try {
        // =========================================
        // GET ORDER ID
        // =========================================

        const { id } = await params;

        // =========================================
        // CHECK LOGIN
        // =========================================

        const userId =
            await getSessionUserId();

        if (!userId) {
            return Response.json(
                {
                    success: false,
                    message:
                        "Please login first.",
                },
                {
                    status: 401,
                }
            );
        }

        // =========================================
        // CONNECT DATABASE
        // =========================================

        await connectDB();

        // =========================================
        // GET REQUEST BODY
        // =========================================

        const body =
            await request.json();

        const reason =
            typeof body?.reason === "string"
                ? body.reason.trim()
                : "";

        // =========================================
        // FIND ORDER
        // ONLY THE OWNER CAN CANCEL
        // =========================================

        const order =
            await Order.findOne({
                _id: id,
                user: userId,
            });

        if (!order) {
            return Response.json(
                {
                    success: false,
                    message:
                        "Order not found.",
                },
                {
                    status: 404,
                }
            );
        }

        // =========================================
        // CHECK ORDER STATUS
        // =========================================

        if (
            ![
                "pending",
                "confirmed",
            ].includes(order.status)
        ) {
            return Response.json(
                {
                    success: false,
                    message:
                        `This order cannot be cancelled because it is already ${order.status.replaceAll(
                            "_",
                            " "
                        )}.`,
                },
                {
                    status: 400,
                }
            );
        }

        // =========================================
        // SAVE PREVIOUS STATUS
        // =========================================

        order.cancellationPreviousStatus =
            order.status;

        // =========================================
        // SAVE CANCELLATION REASON
        // =========================================

        order.cancellationReason =
            reason;

        // =========================================
        // SAVE REQUEST TIME
        // =========================================

        order.cancellationRequestedAt =
            new Date();

        // =========================================
        // CHANGE ORDER STATUS
        // =========================================

        order.status =
            "cancellation_requested";

        // =========================================
        // SAVE ORDER
        // =========================================

        await order.save();

        // =========================================
        // POPULATE PRODUCTS
        // =========================================

        await order.populate({
            path: "items.product",
            select:
                "name image price",
        });

        // =========================================
        // SUCCESS
        // =========================================

        return Response.json(
            {
                success: true,
                message:
                    "Cancellation request sent to admin.",
                order,
            },
            {
                status: 200,
            }
        );

    } catch (error) {
        console.error(
            "Cancel order error:",
            error
        );

        return Response.json(
            {
                success: false,
                message:
                    error?.message ||
                    "Failed to request cancellation.",
            },
            {
                status: 500,
            }
        );
    }
}