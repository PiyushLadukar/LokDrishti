import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");
  if (!url || !url.includes("wikimedia.org")) {
    return new NextResponse("Invalid URL", { status: 400 });
  }

  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "LokDrishti/1.0 (civic-transparency-project)",
      },
    });

    if (!res.ok) {
      return new NextResponse("Image not found", { status: 404 });
    }

    const contentType = res.headers.get("content-type") || "image/jpeg";
    const buffer = await res.arrayBuffer();

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400", // cache 24h
      },
    });
  } catch {
    return new NextResponse("Failed to fetch image", { status: 500 });
  }
}