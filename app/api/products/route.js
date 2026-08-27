import connectDB from "../../../lib/db";
import Product from "../../../models/Product";

export async function GET() {
  try {
    await connectDB();

    const products = await Product.find().sort({
      createdAt: -1,
    });

    return Response.json({
      success: true,
      products,
    });
  } catch (error) {
    console.error("Get products error:", error);

    return Response.json(
      {
        success: false,
        message: "Failed to fetch products",
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();

    const product = await Product.create(body);

    return Response.json(
      {
        success: true,
        message: "Product created successfully",
        product,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("Create product error:", error);

    return Response.json(
      {
        success: false,
        message: "Failed to create product",
      },
      {
        status: 500,
      }
    );
  }
}