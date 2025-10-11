import {NextRequest, NextResponse} from "next/server";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const query: any = searchParams.get("query");
    const queryResult = new URLSearchParams(query);
    let latitude: any = queryResult.get("lat");
    let longitude: any = queryResult.get("lon");
    console.log("Query: ", query, latitude, longitude);
    if (!query) {
        return NextResponse.json({ error: "Missing location" }, { status: 400 });
    }

    try {
        const apiKey = process.env.OPENWEATHER_API_KEY;
        console.log("Key: ", apiKey);

        if (!apiKey) {
            return NextResponse.json(
                { error: "Missing API key in environment" },
                { status: 500 }
            );
        }

        const res = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?lat=${encodeURIComponent(latitude)}&lon=${encodeURIComponent(longitude)}&units=metric&appid=${apiKey}`
        );

        if (!res.ok) {
            const errData = await res.json().catch(() => ({}));
            return NextResponse.json(
                { error: errData.message || "Invalid location" },
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