import {NextRequest, NextResponse} from "next/server";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const postcode = searchParams.get("query");

    if (!postcode) {
        return NextResponse.json({ error: "Missing postcode" }, { status: 400 });
    }

    try {
        // Remove spaces and uppercase the postcode for consistency
        const formattedPostcode = postcode?.trim().toUpperCase() || "";

        const res = await fetch(
            `https://api.postcodes.io/postcodes/${encodeURIComponent(
                formattedPostcode
            )}`
        );

        if (!res.ok) {
            const errData = await res.json().catch(() => ({}));
            return NextResponse.json(
                { error: errData.error || "Invalid postcode" },
                { status: res.status }
            );
        }

        const data = await res.json();
        return NextResponse.json(data);
    } catch (err: unknown) {
        const message =
            err instanceof Error ? err.message : "Unexpected server error";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}