import { NextResponse } from "next/server"

export async function POST(req: Request){
  try{
    const body = await req.json()
    const { amount, email, name } = body

    const res = await fetch("https://api.flutterwave.com/v3/payments", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.FLW_V4_SECRET_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        tx_ref: `haqq-${Date.now()}`,
        amount: amount,
        currency: "NGN",
        redirect_url: "https://haqq-gray.vercel.app/donate/success",
        customer: { email: email, name: name || "HAQQ Supporter" },
        customizations: { title: "Support HAQQ", description: "Sadaqah - Quran 2:282" }
      })
    })

    const data = await res.json()
    return NextResponse.json(data)

  }catch(e:any){
    return NextResponse.json({error: e.message}, {status: 500})
  }
}
