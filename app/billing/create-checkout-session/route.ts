// app/api/billing/create-checkout-session/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { stripe, PLANS } from "@/lib/billing";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Try to extract priceId from either a standard HTML form or JSON body. */
async function getPriceId(req: Request): Promise<string | null> {
    // 1) Try FormData (our Pricing page posts <form> with hidden input name="priceId")
    try {
        const form = await req.formData();
        const fromForm = form.get("priceId");
        if (typeof fromForm === "string" && fromForm.trim().length > 0) {
            return fromForm.trim();
        }
    } catch {
        // ignore and try JSON next
    }

    // 2) Try JSON body
    try {
        const body = await req.json();
        const fromJson =
            typeof body === "string" ? body :
                (body && typeof body === "object" && "priceId" in body ? (body as any).priceId : null);
        if (typeof fromJson === "string" && fromJson.trim().length > 0) {
            return fromJson.trim();
        }
    } catch {
        // no body / not JSON
    }

    return null;
}

export async function POST(req: Request) {
    // Auth
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse priceId robustly
    const priceId = await getPriceId(req);
    if (!priceId) {
        return NextResponse.json({ error: "Missing priceId" }, { status: 400 });
    }

    // Validate against known price IDs (from env)
    const allowed = new Set(Object.values(PLANS));
    if (!allowed.has(priceId)) {
        return NextResponse.json({ error: "Invalid priceId" }, { status: 400 });
    }

    // Load user (with stripe fields)
    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { id: true, email: true, name: true, stripeCustomerId: true },
    });
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Ensure Stripe customer
    let customerId = user.stripeCustomerId ?? undefined;
    if (!customerId) {
        const customer = await stripe.customers.create({
            email: user.email ?? undefined,
            name: user.name ?? undefined,
            metadata: { userId: user.id },
        });
        customerId = customer.id;
        await prisma.user.update({
            where: { id: user.id },
            data: { stripeCustomerId: customerId },
        });
    }

    // Create Checkout Session
    const checkout = await stripe.checkout.sessions.create({
        mode: "subscription",
        customer: customerId,
        line_items: [{ price: priceId, quantity: 1 }],
        success_url: process.env.NEXT_PUBLIC_STRIPE_SUCCESS_URL!,
        cancel_url: process.env.NEXT_PUBLIC_STRIPE_CANCEL_URL!,
        allow_promotion_codes: true,
    });

    return NextResponse.json({ url: checkout.url }, { status: 200 });
}