import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { stripe } from '../../../lib/stripe'

export async function POST(req) {
  try {
    const headersList = await headers()
    const origin = headersList.get('origin')
    const body = await req.json();
    const { hireId, lawyerName, fee } = body;

    if (!hireId || !fee) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Consultation Fee - ${lawyerName}`,
            },
            unit_amount: Math.round(fee * 100),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${origin}/dashboard/user/hiring-history?payment=success&hireId=${hireId}`,
      cancel_url: `${origin}/dashboard/user/hiring-history?payment=cancelled`,
      metadata: {
        hireId: hireId,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    return NextResponse.json(
      { error: err.message },
      { status: err.statusCode || 500 }
    )
  }
}