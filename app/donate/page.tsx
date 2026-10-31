"use client"
import { useState } from "react"

export default function DonatePage(){
  const [copied, setCopied] = useState(false)
  const acct = "0253559865"
  const name = "Liasu Habeeblah Olalekan"
  const bank = "WEMA BANK"

  const copy = () => {
    navigator.clipboard.writeText(acct)
    setCopied(true)
    setTimeout(()=>setCopied(false), 2000)
  }

  return(
    <div style={{maxWidth: 500, margin: "40px auto", padding: 20, fontFamily: "sans-serif"}}>
      <h1 style={{fontSize: 28, fontWeight: "bold"}}>Support HAQQ — Sadaqah Jariyah</h1>
      <p style={{marginTop: 10, color: "#666"}}>Quran 2:282 — Preserving Amanah</p>

      <div style={{marginTop: 30, border: "2px solid #000", borderRadius: 16, padding: 24, background: "#fff"}}>
        <p style={{fontSize: 14, color: "#888"}}>BANK NAME</p>
        <p style={{fontWeight: "bold", fontSize: 18}}>{bank}</p>
        
        <p style={{fontSize: 14, color: "#888", marginTop: 15}}>ACCOUNT NAME</p>
        <p style={{fontWeight: "bold", fontSize: 18}}>{name}</p>

        <p style={{fontSize: 14, color: "#888", marginTop: 15}}>ACCOUNT NUMBER</p>
        <p style={{fontWeight: "bold", fontSize: 28, letterSpacing: 2}}>{acct}</p>
        
        <button onClick={copy} style={{marginTop: 20, padding: "14px 20px", background: "black", color: "white", borderRadius: 10, width: "100%", fontSize: 16, fontWeight: "bold", cursor: "pointer"}}>
          {copied ? "Copied! ✅" : "Copy Account Number"}
        </button>
      </div>

      <div style={{marginTop: 20, padding: 18, background: "#e8f5e9", borderRadius: 12, border: "1px solid #c8e6c9"}}>
        <p style={{fontWeight: "bold"}}>After Transfer:</p>
        <p style={{marginTop: 8}}>1. Screenshot your receipt</p>
        <p>2. Send proof to WhatsApp</p>
        <a href="https://wa.me/2347041935986?text=Salam!%20I%20just%20supported%20HAQQ%20with%20Sadaqah.%20Here%20is%20my%20receipt" 
           target="_blank"
           style={{display: "block", marginTop: 12, padding: "12px", background: "#25D366", color: "white", textAlign: "center", borderRadius: 8, fontWeight: "bold", textDecoration: "none"}}>
          📱 Send Proof on WhatsApp
        </a>
      </div>

      <p style={{marginTop: 20, fontSize: 12, color: "#999", textAlign: "center"}}>100% Amanah • No charges • Direct Sadaqah Jariyah for you</p>
    </div>
  )
}
