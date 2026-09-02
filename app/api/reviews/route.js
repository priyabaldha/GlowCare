import connectDB from "../../../lib/db";
import Review from "../../../models/Review";
import Order from "../../../models/Order";
import Product from "../../../models/Product";
import { getSessionUserId } from "../../../lib/auth";

// =========================================
// GET → GET REVIEWS FOR PRODUCT
// =========================================

export async function GET(request) {
    try {
        const { searchParams } =
            new URL(request.url);

        const productId =
            searchParams.get("productId");

        if (!productId) {
            return Response.json(
                {
                    success: false,
                    message:
                        "Product ID is required.",
                },
                { status: 400 }
            );
        }

        await connectDB();

        const reviews =
            await Review.find({
                product: productId,
            })
                .populate(
                    "user",
                    "name"
                )
                .sort({
                    createdAt: -1,
                })
                .lean();

        const totalReviews =
            reviews.length;

        const averageRating =
            totalReviews > 0
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

        return Response.json({
            success: true,

            reviews,

            totalReviews,

            averageRating:
                Math.round(
                    averageRating * 10
                ) / 10,
        });
    } catch (error) {
        console.error(
            "Get reviews error:",
            error
        );

        return Response.json(
            {
                success: false,
                message:
                    "Failed to get reviews.",
            },
            { status: 500 }
        );
    }
}


// =========================================
// POST → CREATE REVIEW
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
            productId,
            rating,
            comment,
        } = await request.json();

        // =========================================
        // VALIDATION
        // =========================================

        if (!productId) {
            return Response.json(
                {
                    success: false,
                    message:
                        "Product ID is required.",
                },
                { status: 400 }
            );
        }

        if (
            !rating ||
            rating < 1 ||
            rating > 5
        ) {
            return Response.json(
                {
                    success: false,
                    message:
                        "Rating must be between 1 and 5.",
                },
                { status: 400 }
            );
        }

        if (!comment?.trim()) {
            return Response.json(
                {
                    success: false,
                    message:
                        "Please write a review.",
                },
                { status: 400 }
            );
        }

        await connectDB();

        // =========================================
        // CHECK PRODUCT
        // =========================================

        const product =
            await Product.findById(
                productId
            );

        if (!product) {
            return Response.json(
                {
                    success: false,
                    message:
                        "Product not found.",
                },
                { status: 404 }
            );
        }

        // =========================================
        // CHECK EXISTING REVIEW
        // =========================================

        const existingReview =
            await Review.findOne({
                user: userId,
                product: productId,
            });

        if (existingReview) {
            return Response.json(
                {
                    success: false,
                    message:
                        "You have already reviewed this product.",
                },
                { status: 400 }
            );
        }

        // =========================================
        // FIND DELIVERED ORDER
        // =========================================

        const order =
            await Order.findOne({
                user: userId,

                status: "delivered",

                "items.product":
                    productId,
            }).sort({
                deliveredAt: -1,
            });

        if (!order) {
            return Response.json(
                {
                    success: false,
                    message:
                        "You can review this product after your order is delivered.",
                },
                { status: 403 }
            );
        }

        // =========================================
        // CREATE REVIEW
        // =========================================

        const review =
            await Review.create({
                user: userId,
                product: productId,
                order: order._id,
                rating: Number(rating),
                comment: comment.trim(),
            });

        // =========================================
        // UPDATE PRODUCT RATING
        // =========================================

        const allReviews =
            await Review.find({
                product: productId,
            }).select(
                "rating"
            );

        const averageRating =
            allReviews.reduce(
                (
                    total,
                    review
                ) =>
                    total +
                    review.rating,
                0
            ) /
            allReviews.length;

        await Product.findByIdAndUpdate(
            productId,
            {
                rating:
                    Math.round(
                        averageRating *
                            10
                    ) / 10,
            }
        );

        return Response.json(
            {
                success: true,
                message:
                    "Review submitted successfully.",
                review,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error(
            "Create review error:",
            error
        );

        return Response.json(
            {
                success: false,
                message:
                    "Failed to submit review.",
            },
            { status: 500 }
        );
    }
}