import { NextResponse } from "next/server"

export async function POST(req: Request){
  const { amount, email, name } = await req.json()
  
  const res = await fetch("https://api.flutterwave.com/v4/transactions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.FLW_V4_SECRET_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      amount: amount,
      currency: "NGN",
      tx_ref: `haqq-${Date.now()}`,
      email: email,
      full_name: name || "HAQQ Supporter",
      redirect_url: "https://haqq-gray.vercel.app/donate/success",
      meta: { source: "HAQQ Sadaqah" },
      customization: { title: "Support HAQQ", description: "Keep Amanah alive" }
    })
  })

  const data = await res.json()
  return NextResponse.json(data)
}
