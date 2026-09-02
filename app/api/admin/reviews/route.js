import connectDB from "../../../../lib/db";
import Review from "../../../../models/Review";
import Product from "../../../../models/Product";
import { getSessionUserId } from "../../../../lib/auth";


// =========================================
// CHECK ADMIN
// =========================================

async function checkAdmin() {
    const userId =
        await getSessionUserId();

    if (!userId) {
        return {
            authorized: false,
            status: 401,
            message:
                "Please login first.",
        };
    }

    await connectDB();

    const User =
        (await import("../../../../models/User"))
            .default;

    const user =
        await User.findById(userId)
            .select("role")
            .lean();

    if (!user || user.role !== "admin") {
        return {
            authorized: false,
            status: 403,
            message:
                "Admin access required.",
        };
    }

    return {
        authorized: true,
    };
}


// =========================================
// GET → ALL REVIEWS
// =========================================

export async function GET() {
    try {
        const auth =
            await checkAdmin();

        if (!auth.authorized) {
            return Response.json(
                {
                    success: false,
                    message:
                        auth.message,
                },
                {
                    status:
                        auth.status,
                }
            );
        }

        const reviews =
            await Review.find()
                .populate(
                    "user",
                    "name email"
                )
                .populate(
                    "product",
                    "name image price"
                )
                .populate(
                    "order",
                    "status createdAt"
                )
                .sort({
                    createdAt: -1,
                })
                .lean();

        const totalReviews =
            reviews.length;

        const averageRating =
            totalReviews
                ? reviews.reduce(
                      (
                          total,
                          review
                      ) =>
                          total +
                          review.rating,
                      0
                  ) /
                  totalReviews
                : 0;

        const fiveStarReviews =
            reviews.filter(
                (review) =>
                    review.rating === 5
            ).length;

        return Response.json({
            success: true,
            reviews,
            summary: {
                totalReviews,
                averageRating:
                    Math.round(
                        averageRating * 10
                    ) / 10,
                fiveStarReviews,
            },
        });
    } catch (error) {
        console.error(
            "Get admin reviews error:",
            error
        );

        return Response.json(
            {
                success: false,
                message:
                    "Failed to get reviews.",
            },
            {
                status: 500,
            }
        );
    }
}


// =========================================
// DELETE → DELETE REVIEW
// =========================================

export async function DELETE(request) {
    try {
        const auth =
            await checkAdmin();

        if (!auth.authorized) {
            return Response.json(
                {
                    success: false,
                    message:
                        auth.message,
                },
                {
                    status:
                        auth.status,
                }
            );
        }

        const {
            reviewId,
        } = await request.json();

        if (!reviewId) {
            return Response.json(
                {
                    success: false,
                    message:
                        "Review ID is required.",
                },
                {
                    status: 400,
                }
            );
        }

        const review =
            await Review.findById(
                reviewId
            );

        if (!review) {
            return Response.json(
                {
                    success: false,
                    message:
                        "Review not found.",
                },
                {
                    status: 404,
                }
            );
        }

        const productId =
            review.product;

        await Review.findByIdAndDelete(
            reviewId
        );


        // =========================================
        // RECALCULATE PRODUCT RATING
        // =========================================

        const remainingReviews =
            await Review.find({
                product: productId,
            }).select("rating");

        const newRating =
            remainingReviews.length
                ? remainingReviews.reduce(
                      (
                          total,
                          item
                      ) =>
                          total +
                          item.rating,
                      0
                  ) /
                  remainingReviews.length
                : 0;

        await Product.findByIdAndUpdate(
            productId,
            {
                rating:
                    Math.round(
                        newRating * 10
                    ) / 10,
            }
        );

        return Response.json({
            success: true,
            message:
                "Review deleted successfully.",
        });
    } catch (error) {
        console.error(
            "Delete admin review error:",
            error
        );

        return Response.json(
            {
                success: false,
                message:
                    "Failed to delete review.",
            },
            {
                status: 500,
            }
        );
    }
}