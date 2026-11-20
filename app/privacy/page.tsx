export default function Privacy(){
  return (
    <div className="min-h-screen bg-[#0a1628] text-white p-4 pb-28">
      <div className="bg-white text-black rounded-[24px] p-8 max-w-3xl mx-auto space-y-5 mt-4">
        <h1 className="text-2xl font-bold">Privacy & Wasiyyah Policy</h1>
        <p className="text-sm text-gray-500">Last updated: 20 November 2026 • Lagos, Nigeria</p>

        <div className="space-y-4 text-sm leading-relaxed text-gray-700">
          <div>
            <h2 className="font-bold text-black">1. What We Store</h2>
            <p>Your email, your name, and the Haqq you choose to record: who you owe, what you owe, and amount. We do not ask for your BVN, bank password, or card details.</p>
          </div>

          <div>
            <h2 className="font-bold text-black">2. Who Can See Your Vault</h2>
            <p>Only you — after you log in. Your Vault is tied to your account and protected by Row Level Security. We designed HAQQ so that other users cannot see your Vault, and our Admin dashboard only shows counts, not your private entries. We do not read your debts.</p>
          </div>

          <div>
            <h2 className="font-bold text-black">3. Wasiyyah (Will)</h2>
            <p>Your Wasiyyah is a document <b>you</b> write for your family. HAQQ does not automatically unlock or send your Vault to anyone after you pass away. If you want your family to know your debts, share your Wasiyyah with them yourself, or give a trusted person your login details while you are alive. There is no automatic family unlock.</p>
          </div>

          <div>
            <h2 className="font-bold text-black">4. What We Never Do</h2>
            <p>We never sell your data. We never share your Vault with third parties. We never send your debts to anyone.</p>
          </div>

          <div>
            <h2 className="font-bold text-black">5. Deleting Your Data</h2>
            <p>You can delete a Haqq anytime from your Vault. To delete your whole account and all your data, email us at <a href="mailto:Haqqsupport@gmail.com" className="font-bold text-[#0a1628]">Haqqsupport@gmail.com</a> from the same email you used to sign up.</p>
          </div>

          <div>
            <h2 className="font-bold text-black">6. Donations</h2>
            <p>If you donate, we only keep the amount, project, and proof you upload to confirm it. We do not store your card details.</p>
          </div>
        </div>

        <div className="bg-gray-50 rounded-xl p-4 text-sm">
          <p><b>Questions?</b> Email <a href="mailto:Haqqsupport@gmail.com" className="font-bold">Haqqsupport@gmail.com</a> or WhatsApp +234 704 193 5986</p>
        </div>
      </div>
    </div>
  )
}
