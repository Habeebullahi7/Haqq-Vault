import { NextResponse } from "next/server"

export async function POST(req: Request){
  try {
    const { amount, email, name } = await req.json()
    
    if(!process.env.FLW_V4_SECRET_KEY){
      return NextResponse.json({ error: "FLW_V4_SECRET_KEY not found in Vercel env" }, { status: 500 })
    }

    // Flutterwave V3 endpoint still works for V4 keys - this is the stable one
    const res = await fetch("https://api.flutterwave.com/v3/payments", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.FLW_V4_SECRET_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        tx_ref: `haqq-${Date.now()}`,
        amount: amount,
        currency: "NGN",
        redirect_url: "https://haqq-gray.vercel.app/donate/success",
        customer: {
          email: email,
          name: name || "HAQQ Supporter"
        },
        customizations: {
          title: "Support HAQQ",
          description: "Sadaqah for Amanah - Quran 2:282",
          logo: "https://haqq-gray.vercel.app/icon.png"
        }
      })
    })

    const data = await res.json()
    console.log("FLW Response:", data)
    return NextResponse.json(data)

  } catch(err:any){
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
