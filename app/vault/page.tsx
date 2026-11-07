'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

type Debt = { id: number; title: string; amount: number; person: string; type: string; status: string }

export default function VaultPage() {
  const [userEmail, setUserEmail] = useState('guest@haqq.app')
  const [tab, setTab] = useState<'debts' | 'wasiyyah'>('debts')
  const [debts, setDebts] = useState<Debt[]>([])
  const [wasiyyah, setWasiyyah] = useState('')
  const [showAdd, setShowAdd] = useState(false)
  const [title, setTitle] = useState('')
  const [amount, setAmount] = useState('')
  const [person, setPerson] = useState('')
  const [type, setType] = useState('I Owe')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // No login for now - use saved email if e dey, if not use guest
    const saved = localStorage.getItem('haqq_user') || 'guest@haqq.app'
    setUserEmail(saved)
    loadData(saved)
  }, [])

  async function loadData(email: string) {
    setLoading(true)
    const { data: debtData } = await supabase.from('haqq_debts').select('*').eq('user_email', email).order('created_at', { ascending: false })
    if (debtData) setDebts(debtData as Debt[])
    const { data: wData } = await supabase.from('haqq_wasiyyah').select('content').eq('user_email', email).maybeSingle()
    if (wData) setWasiyyah(wData.content)
    setLoading(false)
  }

  async function addDebt(e: React.FormEvent) {
    e.preventDefault()
    if (!title || !amount) return
    const { data, error } = await supabase.from('haqq_debts').insert({ user_email: userEmail, title, amount: parseFloat(amount), person, type, status: 'Unpaid' }).select().single()
    if (!error && data) {
      setDebts([data as Debt, ...debts])
      setTitle(''); setAmount(''); setPerson(''); setShowAdd(false)
    } else if (error) {
      alert('Could not save: ' + error.message)
    }
  }

  async function togglePaid(d: Debt) {
    const newStatus = d.status === 'Paid' ? 'Unpaid' : 'Paid'
    await supabase.from('haqq_debts').update({ status: newStatus }).eq('id', d.id)
    setDebts(debts.map(x => x.id === d.id ? { ...x, status: newStatus } : x))
  }

  async function deleteDebt(id: number) {
    if (!confirm('Delete this entry?')) return
    await supabase.from('haqq_debts').delete().eq('id', id)
    setDebts(debts.filter(x => x.id !== id))
  }

  async function saveWasiyyah() {
    const { data } = await supabase.from('haqq_wasiyyah').select('id').eq('user_email', userEmail).maybeSingle()
    if (data) await supabase.from('haqq_wasiyyah').update({ content: wasiyyah }).eq('user_email', userEmail)
    else await supabase.from('haqq_wasiyyah').insert({ user_email: userEmail, content: wasiyyah })
    alert('Wasiyyah Saved')
  }

  function goHome() {
    window.location.href = '/'
  }

  const totalOwe = debts.filter(d => d.type === 'I Owe' && d.status === 'Unpaid').reduce((s, d) => s + Number(d.amount), 0)
  const totalOwedToMe = debts.filter(d => d.type === 'Owes Me' && d.status === 'Unpaid').reduce((s, d) => s + Number(d.amount), 0)

  if (loading) return <div style={{ minHeight: '100vh', background: '#0f172a', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading Vault...</div>

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', color: '#fff', padding: '0 16px 40px' }}>
      <div style={{ maxWidth: 480, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 0' }}>
          <div>
            <div style={{ fontWeight: 900, letterSpacing: 3, fontSize: 18 }}>HAQQ 🔒</div>
            <div style={{ fontSize: 12, color: '#94a3b8' }}>{userEmail}</div>
          </div>
          <button onClick={goHome} style={{ background: '#fff', color: '#0f172a', border: 'none', padding: '8px 14px', borderRadius: 20, fontWeight: 800, fontSize: 12, cursor: 'pointer' }}>Home</button>
        </div>

        <div style={{ background: '#fff', color: '#0f172a', borderRadius: 20, padding: 20, border: '2px solid #D4AF37' }}>
          <p style={{ fontSize: 11, fontWeight: 800, color: '#64748b', margin: 0 }}>TOTAL BALANCE</p>
          <h1 style={{ fontSize: 32, margin: '6px 0', fontWeight: 900 }}>₦{totalOwe.toLocaleString()}</h1>
          <div style={{ display: 'flex', gap: 10 }}>
            <div style={{ flex: 1, background: '#fef2f2', padding: 12, borderRadius: 12 }}>
              <p style={{ fontSize: 11, margin: 0, color: '#dc2626', fontWeight: 700 }}>I OWE</p>
              <p style={{ fontSize: 18, fontWeight: 900, margin: '4px 0 0' }}>₦{totalOwe.toLocaleString()}</p>
            </div>
            <div style={{ flex: 1, background: '#f0fdf4', padding: 12, borderRadius: 12 }}>
              <p style={{ fontSize: 11, margin: 0, color: '#16a34a', fontWeight: 700 }}>OWES ME</p>
              <p style={{ fontSize: 18, fontWeight: 900, margin: '4px 0 0' }}>₦{totalOwedToMe.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
          <button onClick={() => setTab('debts')} style={{ flex: 1, padding: 12, borderRadius: 12, border: 'none', background: tab === 'debts' ? '#D4AF37' : '#1e293b', color: tab === 'debts' ? '#0f172a' : '#fff', fontWeight: 800, cursor: 'pointer' }}>Debts &amp; Haqq</button>
          <button onClick={() => setTab('wasiyyah')} style={{ flex: 1, padding: 12, borderRadius: 12, border: 'none', background: tab === 'wasiyyah' ? '#D4AF37' : '#1e293b', color: tab === 'wasiyyah' ? '#0f172a' : '#fff', fontWeight: 800, cursor: 'pointer' }}>Wasiyyah</button>
        </div>

        {tab === 'debts' && (
          <div style={{ marginTop: 16 }}>
            <button onClick={() => setShowAdd(!showAdd)} style={{ width: '100%', padding: 14, borderRadius: 14, background: '#fff', color: '#0f172a', border: 'none', fontWeight: 800, cursor: 'pointer' }}>{showAdd ? 'Close' : '+ Add New Debt / Haqq'}</button>
            {showAdd && (
              <form onSubmit={addDebt} style={{ background: '#fff', color: '#0f172a', borderRadius: 16, padding: 16, marginTop: 10, display: 'flex', flexDirection: 'column', gap: 10 }}>
                <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="What is it for? e.g. Loan from Ahmed" required style={{ padding: 12, borderRadius: 10, border: '1px solid #e2e8f0', fontSize: 14 }} />
                <input value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Amount (Naira)" type="number" required style={{ padding: 12, borderRadius: 10, border: '1px solid #e2e8f0', fontSize: 14 }} />
                <input value={person} onChange={(e) => setPerson(e.target.value)} placeholder="Person name" style={{ padding: 12, borderRadius: 10, border: '1px solid #e2e8f0', fontSize: 14 }} />
                <select value={type} onChange={(e) => setType(e.target.value)} style={{ padding: 12, borderRadius: 10, border: '1px solid #e2e8f0', fontSize: 14 }}>
                  <option value="I Owe">I Owe Someone</option>
                  <option value="Owes Me">Someone Owes Me</option>
                </select>
                <button style={{ padding: 13, borderRadius: 10, background: '#0f172a', color: '#fff', fontWeight: 800, border: 'none' }}>Save</button>
              </form>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 12 }}>
              {debts.length === 0 && <p style={{ textAlign: 'center', color: '#94a3b8', padding: 20 }}>No debts yet. Add your first one above.</p>}
              {debts.map((d) => (
                <div key={d.id} style={{ background: '#fff', color: '#0f172a', borderRadius: 14, padding: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <p style={{ fontWeight: 800, margin: 0, fontSize: 14 }}>{d.title}</p>
                    <p style={{ color: '#64748b', fontSize: 12, margin: '4px 0 0' }}>{d.person} • {d.type} • <span style={{ color: d.status === 'Paid' ? '#16a34a' : '#dc2626', fontWeight: 700 }}>{d.status}</span></p>
                    <p style={{ fontWeight: 900, fontSize: 16, margin: '6px 0 0' }}>₦{Number(d.amount).toLocaleString()}</p>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <button onClick={() => togglePaid(d)} style={{ background: d.status === 'Paid' ? '#f1f5f9' : '#22c55e', color: d.status === 'Paid' ? '#0f172a' : '#fff', border: 'none', padding: '7px 10px', borderRadius: 8, fontSize: 11, fontWeight: 800, cursor: 'pointer' }}>{d.status === 'Paid' ? 'Mark Unpaid' : 'Mark Paid'}</button>
                    <button onClick={() => deleteDebt(d.id)} style={{ background: '#fef2f2', color: '#dc2626', border: 'none', padding: '7px 10px', borderRadius: 8, fontSize: 11, fontWeight: 800, cursor: 'pointer' }}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'wasiyyah' && (
          <div style={{ marginTop: 16, background: '#fff', color: '#0f172a', borderRadius: 16, padding: 16 }}>
            <h3 style={{ margin: '0 0 8px', fontSize: 16, fontWeight: 900 }}>My Wasiyyah (Will)</h3>
            <p style={{ color: '#64748b', fontSize: 12, margin: '0 0 12px' }}>Write what your family should know. It is saved privately to your account.</p>
            <textarea value={wasiyyah} onChange={(e) => setWasiyyah(e.target.value)} placeholder="Bismillah... My Wasiyyah..." rows={10} style={{ width: '100%', boxSizing: 'border-box', padding: 14, borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 14, lineHeight: 1.6 }} />
            <button onClick={saveWasiyyah} style={{ marginTop: 10, width: '100%', padding: 14, borderRadius: 12, background: '#0f172a', color: '#fff', fontWeight: 800, border: 'none', cursor: 'pointer' }}>Save Wasiyyah</button>
          </div>
        )}
      </div>
    </div>
  )
  }
