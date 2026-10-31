import { NextResponse } from "next/server"

export async function POST(req: Request){
  try{
    const { amount, email, name } = await req.json()
    const secret = process.env.FLW_V4_SECRET_KEY

    const res = await fetch("https://api.flutterwave.com/v3/payments", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secret}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        tx_ref: `haqq-${Date.now()}`,
        amount,
        currency: "NGN",
        redirect_url: "https://haqq-gray.vercel.app/donate/success",
        customer: { email, name: name || "HAQQ User" },
        customizations: {
          title: "Support HAQQ",
          description: "Sadaqah for Amanah",
        }
      })
    })

    const data = await res.json()
    return NextResponse.json(data)
  }catch(e:any){
    return NextResponse.json({error: e.message}, {status: 500})
  }
}
