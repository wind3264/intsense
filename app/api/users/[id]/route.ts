import { NextResponse } from "next/server";
import { getProfile } from "@/lib/solutions";

// A user's public profile: name, solve history and posted solutions.
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const profile = await getProfile((await params).id);
    if (!profile) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json(profile);
}
