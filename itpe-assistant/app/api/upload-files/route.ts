/**
 * File Upload API for Client-Side Uploads
 * 클라이언트에서 파일을 Vercel Blob에 업로드
 */

import { put } from "@vercel/blob";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const files = formData.getAll("files") as File[];

        if (files.length === 0) {
            return NextResponse.json(
                { error: "No files uploaded" },
                { status: 400 }
            );
        }

        console.log(`[Upload] Uploading ${files.length} files...`);

        // Upload all files in parallel
        const uploadPromises = files.map(async (file, index) => {
            const filename = `answer-sheet-${Date.now()}-${index}.${file.name.split(".").pop()}`;

            const blob = await put(filename, file, {
                access: "public",
                token: process.env.ITPE_READ_WRITE_TOKEN,
            });

            return {
                url: blob.url,
                filename: file.name,
                index,
            };
        });

        const results = await Promise.all(uploadPromises);

        console.log(`[Upload] Uploaded ${results.length} files`);

        return NextResponse.json({
            urls: results.map(r => r.url),
            files: results,
        });

    } catch (error) {
        console.error("[Upload] Error:", error);
        return NextResponse.json(
            { error: "Upload failed" },
            { status: 500 }
        );
    }
}
