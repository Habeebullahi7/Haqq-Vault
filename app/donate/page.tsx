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
    <div style={{maxWidth: 500, margin: "40px auto", padding: 20, fontFamily: "sans-serif", color: "#000"}}>
      <h1 style={{fontSize: 28, fontWeight: "bold", color: "#fff"}}>Support HAQQ — Sadaqah Jariyah</h1>
      <p style={{marginTop: 10, color: "#aaa"}}>Quran 2:282 — Preserving Amanah</p>

      <div style={{marginTop: 30, border: "2px solid #000", borderRadius: 16, padding: 24, background: "#ffffff"}}>
        <p style={{fontSize: 12, color: "#666", fontWeight: "bold"}}>BANK NAME</p>
        <p style={{fontWeight: "bold", fontSize: 18, color: "#000"}}>{bank}</p>
        
        <p style={{fontSize: 12, color: "#666", fontWeight: "bold", marginTop: 15}}>ACCOUNT NAME</p>
        <p style={{fontWeight: "bold", fontSize: 18, color: "#000"}}>{name}</p>

        <p style={{fontSize: 12, color: "#666", fontWeight: "bold", marginTop: 15}}>ACCOUNT NUMBER</p>
        <p style={{fontWeight: "bold", fontSize: 28, letterSpacing: 2, color: "#000"}}>{acct}</p>
        
        <button onClick={copy} style={{marginTop: 20, padding: "14px 20px", background: "black", color: "white", borderRadius: 10, width: "100%", fontSize: 16, fontWeight: "bold"}}>
          {copied ? "Copied! ✅" : "Copy Account Number"}
        </button>
      </div>

      <div style={{marginTop: 20, padding: 18, background: "#e8f5e9", borderRadius: 12}}>
        <p style={{fontWeight: "bold", color: "#000"}}>After Transfer:</p>
        <p style={{color: "#000"}}>1. Screenshot your receipt</p>
        <p style={{color: "#000"}}>2. Send proof to WhatsApp</p>
        <a href="https://wa.me/2347041935986?text=Salam!%20I%20just%20supported%20HAQQ" 
           target="_blank"
           style={{display: "block", marginTop: 12, padding: "12px", background: "#25D366", color: "white", textAlign: "center", borderRadius: 8, fontWeight: "bold", textDecoration: "none"}}>
          📱 Send Proof on WhatsApp
        </a>
      </div>
    </div>
  )
}
