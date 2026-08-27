import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

export async function POST(request) {
    try {
        const formData = await request.formData();

        const file = formData.get("file");

        if (!file) {
            return Response.json(
                {
                    success: false,
                    message: "No image was provided.",
                },
                { status: 400 }
            );
        }

        // Only allow images
        if (!file.type.startsWith("image/")) {
            return Response.json(
                {
                    success: false,
                    message: "Only image files are allowed.",
                },
                { status: 400 }
            );
        }

        // Maximum 5MB
        if (file.size > 5 * 1024 * 1024) {
            return Response.json(
                {
                    success: false,
                    message: "Image must be smaller than 5MB.",
                },
                { status: 400 }
            );
        }

        // Get original extension
        const originalName = file.name;

        const extension = path.extname(originalName);

        // Create unique filename
        const fileName = `${randomUUID()}${extension}`;

        // Folder where image will be stored
        const uploadDirectory = path.join(
            process.cwd(),
            "public",
            "uploads",
            "products"
        );

        // Make sure folder exists
        await mkdir(uploadDirectory, {
            recursive: true,
        });

        // Convert uploaded file to Buffer
        const bytes = await file.arrayBuffer();

        const buffer = Buffer.from(bytes);

        // Save image
        const filePath = path.join(
            uploadDirectory,
            fileName
        );

        await writeFile(filePath, buffer);

        // URL that the browser can use
        const imageUrl = `/uploads/products/${fileName}`;

        return Response.json({
            success: true,
            message: "Image uploaded successfully.",
            imageUrl,
        });

    } catch (error) {
        console.error("Image upload error:", error);

        return Response.json(
            {
                success: false,
                message: "Image upload failed.",
            },
            { status: 500 }
        );
    }
}