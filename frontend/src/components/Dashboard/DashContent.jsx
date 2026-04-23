import { useState, useEffect } from 'react'
import {
  FiUploadCloud, FiTrendingUp, FiTrendingDown, FiDollarSign,
  FiTarget, FiPlus, FiTrash2, FiCheck, FiX, FiEdit3,
  FiCalendar, FiTag, FiAlignLeft, FiChevronDown
} from 'react-icons/fi'
import upload from '../../api/upload'
import getTransactions, { getStats } from '../../api/transactions'
import   '../../styles/goals.css'
import { addTransaction } from "../../api/transactions";


/* ─── CONSTANTS ──────────────────────────────────────── */
const CATEGORIES = ['Food', 'Transport', 'Bills', 'Shopping', 'Health', 'Housing', 'Entertainment', 'Salary', 'Freelance', 'Others']
const PERIODS    = ['1 week', '2 weeks', '1 month', '3 months', '6 months', '1 year']
const CAT_ICONS  = { Food:'🍽️', Transport:'🚗', Bills:'📄', Shopping:'🛍️', Health:'💊', Housing:'🏠', Entertainment:'🎬', Salary:'💼', Freelance:'💻', Others:'📦' }

/* ─── GOAL CARD ──────────────────────────────────────── */
function GoalCard({ goal, onDelete }) {
  const pct = Math.min((goal.spent / goal.amount) * 100, 100)
  const over = goal.spent > goal.amount
  return (
    <div className="goal-card">
      <div className="goal-card-accent" />
      <div className="goal-card-header">
        <div className="goal-category-badge">
          <span>{CAT_ICONS[goal.category] || '📦'}</span>
          {goal.category}
        </div>
        <button className="goal-delete-btn" onClick={() => onDelete(goal.id)}>
          <FiTrash2 size={13} />
        </button>
      </div>
      <div className="goal-amount">
        ${goal.amount.toLocaleString()}
        <span style={{ fontSize:'0.95rem', color:'#598392', marginLeft:4, fontFamily:'DM Sans' }}>limit</span>
      </div>
      <div className="goal-period">over {goal.period}</div>
      <div className="goal-progress-wrap">
        <div className="goal-progress-label">
          <span>Spent: ${(goal.spent || 0).toLocaleString()}</span>
          <span style={{ color: over ? '#e07070' : '#AEC3B0' }}>{pct.toFixed(0)}%{over ? ' — over!' : ''}</span>
        </div>
        <div className="goal-progress-track">
          <div className={`goal-progress-fill ${over ? 'over' : ''}`} style={{ width:`${pct}%` }} />
        </div>
      </div>
    </div>
  )
}

/* ─── ADD GOAL FORM ──────────────────────────────────── */
function AddGoalForm({ onAdd, onCancel }) {
  const [form, setForm] = useState({ amount:'', period:'1 month', category:'Food' })
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = () => {
    if (!form.amount || isNaN(Number(form.amount))) return
    onAdd({ id: Date.now(), ...form, amount: Number(form.amount), spent: 0 })
  }

  return (
    <div className="add-goal-card">
      <div style={{ color:'#AEC3B0', fontSize:'0.88rem', fontWeight:500, marginBottom:2 }}>
        New Spending Goal
      </div>
      <div className="form-row">
        <div className="form-field">
          <label className="form-label">Limit Amount ($)</label>
          <input
            className="form-input"
            type="number"
            placeholder="e.g. 300"
            value={form.amount}
            onChange={e => set('amount', e.target.value)}
          />
        </div>
        <div className="form-field">
          <label className="form-label">Period</label>
          <select className="form-select" value={form.period} onChange={e => set('period', e.target.value)}>
            {PERIODS.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
        <div className="form-field full">
          <label className="form-label">Category</label>
          <select className="form-select" value={form.category} onChange={e => set('category', e.target.value)}>
            {CATEGORIES.map(c => <option key={c} value={c}>{CAT_ICONS[c]} {c}</option>)}
          </select>
        </div>
      </div>
      <div className="form-actions">
        <button className="btn-cancel" onClick={onCancel}><FiX size={13}/> Cancel</button>
        <button className="btn-confirm" onClick={handleSubmit}><FiCheck size={13}/> Add Goal</button>
      </div>
    </div>
  )
}

/* ─── MANUAL TRANSACTION FORM ────────────────────────── */
function ManualTransactionForm({ onAdd }) {
  const today = new Date().toISOString().split('T')[0]
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({
    date: today,
    desc: '',
    amount: '',
    type: 'expense',
    category: 'Food',
  })
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = () => {
    if (!form.desc || !form.amount || isNaN(Number(form.amount))) return
    onAdd({ ...form, amount: Number(form.amount) })
    setForm({ date: today, desc:'', amount:'', type:'expense', category:'Food' })
    setOpen(false)
  }

  return (
    <div className="tx-manual-section">
      <div className="tx-manual-card">
        <div className="tx-manual-header" onClick={() => setOpen(o => !o)}>
          <div className="tx-manual-header-left">
            <div className="section-icon"><FiEdit3 size={14}/></div>
            <div>
              <div className="section-title" style={{"font-size" : "24px",}}>Add Transaction Manually</div>
              <div className="section-sub">Log a transaction that isn't in your statement</div>
            </div>
          </div>
          <FiChevronDown className={`tx-manual-chevron ${open ? 'open' : ''}`} size={16} />
        </div>

        {open && (
          <div className="tx-manual-body">
            {/* Type toggle — full row */}
            <div className="form-field" style={{ gridColumn:'1/-1' }}>
              <label className="form-label">Transaction Type</label>
              <div className="type-toggle">
                <button
                  className={`type-toggle-btn ${form.type === 'income' ? 'active-income' : ''}`}
                  onClick={() => set('type', 'income')}
                >
                  <FiTrendingUp size={13}/> Income
                </button>
                <button
                  className={`type-toggle-btn ${form.type === 'expense' ? 'active-expense' : ''}`}
                  onClick={() => set('type', 'expense')}
                >
                  <FiTrendingDown size={13}/> Expense
                </button>
              </div>
            </div>

            {/* Date */}
            <div className="form-field">
              <label className="form-label">Date</label>
              <input
                className="form-input"
                type="date"
                value={form.date}
                onChange={e => set('date', e.target.value)}
                style={{ colorScheme:'dark' }}
              />
            </div>

            {/* Amount */}
            <div className="form-field">
              <label className="form-label">Amount ($)</label>
              <input
                className="form-input"
                type="number"
                placeholder="0.00"
                value={form.amount}
                onChange={e => set('amount', e.target.value)}
              />
            </div>

            {/* Category */}
            <div className="form-field">
              <label className="form-label">Category</label>
              <select className="form-select" value={form.category} onChange={e => set('category', e.target.value)}>
                {CATEGORIES.map(c => <option key={c} value={c}>{CAT_ICONS[c]} {c}</option>)}
              </select>
            </div>

            {/* Description — full row */}
            <div className="form-field" style={{ gridColumn:'1/-1' }}>
              <label className="form-label">Description</label>
              <input
                className="form-input"
                type="text"
                placeholder="e.g. Grocery run at Carrefour"
                value={form.desc}
                onChange={e => set('desc', e.target.value)}
              />
            </div>

            {/* Submit */}
            <div className="tx-submit-row">
              <button className="tx-submit-btn" onClick={handleSubmit}>
                <FiPlus size={15}/> Add Transaction
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

/* ─── MAIN COMPONENT ─────────────────────────────────── */
export default function DashContent() {
  const formatMoney = (num) => Number(num || 0).toLocaleString()

  const [stats, setStats]               = useState({ balance:0, income:0, expenses:0 })
  const [transactions, setTransactions] = useState([])
  const [file, setFile]                 = useState(null)
  const [goals, setGoals]               = useState([
    { id:1, amount:300, period:'1 month', category:'Food',      spent:210 },
    { id:2, amount:150, period:'1 month', category:'Transport', spent:60  },
    { id:3, amount:500, period:'3 months',category:'Shopping',  spent:520 },
  ])
  const [showGoalForm, setShowGoalForm] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    async function fetchData() {
      try {
        const data      = await getTransactions(token)
        const statsData = await getStats(token)
        setStats(statsData)
        setTransactions(data)
      } catch (err) { console.error(err) }
    }
    fetchData()
  }, [])

  async function handleUpload() {
    const token = localStorage.getItem('token')
    try {
      await upload(file, token)
      alert('Upload successful!')
      setFile(null)
      const data      = await getTransactions(token)
      const statsData = await getStats(token)
      setTransactions(data)
      setStats(statsData)
    } catch (error) { alert(error.message) }
  }

  function handleAddGoal(goal) {
    setGoals(g => [...g, goal])
    setShowGoalForm(false)
  }

  function handleDeleteGoal(id) {
    setGoals(g => g.filter(x => x.id !== id))
  }


async function handleAdd(tx) {
  const token = localStorage.getItem("token");

  try {
    const res = await addTransaction(tx, token);

    // update UI instantly
    setTransactions(prev => [res.transaction, ...prev]);

  } catch (err) {
    alert(err.message);
  }
}

  return (
    <>
      <main className="db-content">

        {/* ── UPLOAD ──────────────────────────────────────── */}
        <div className="upload-card">
          <div className="upload-left">
            <div className="upload-icon-wrap"><FiUploadCloud /></div>
            <div>
              <div className="upload-title">Upload Bank Statement</div>
              <div className="upload-sub">{file?.name || 'CSV or PDF supported — drag & drop or browse'}</div>
            </div>
          </div>
          <div className="upload-right">
            <label className="file-input-label">
              <FiUploadCloud size={14} />
              {file?.name ? 'Change file' : 'Browse file'}
              <input type="file" className="file-input" accept=".csv,.pdf"
                onChange={e => setFile(e.target.files[0] || null)} />
            </label>
            <button className="upload-btn" onClick={handleUpload}>
              <FiUploadCloud size={14} /> Upload
            </button>
          </div>
        </div>

        {/* ── STATS ───────────────────────────────────────── */}
        <div className="stat-grid">
          <div className="stat-card blue">
            <div className="stat-label"><div className="stat-icon blue"><FiDollarSign /></div>Total Balance</div>
            <div className="stat-value">${formatMoney(stats.balance)>0 ? formatMoney(stats.balance) : '0.00'}</div>
            <div className="stat-change neutral">As of this month</div>
          </div>
          <div className="stat-card green">
            <div className="stat-label"><div className="stat-icon green"><FiTrendingUp /></div>Total Income</div>
            <div className="stat-value">${formatMoney(stats.income)}</div>
          </div>
          <div className="stat-card red">
            <div className="stat-label"><div className="stat-icon red"><FiTrendingDown /></div>Total Expenses</div>
            <div className="stat-value">${formatMoney(stats.expenses)}</div>
          </div>
        </div>

        {/* ── GOALS ───────────────────────────────────────── */}
        <div className="goals-section">
          <div className="section-header">
            <div className="section-title-wrap">
              
              <div>
                <div className="section-title" style={{"font-size": "24px"}}>Spending Goals</div>
                <div className="section-sub">Track your budget targets by category</div>
              </div>
            </div>
            {!showGoalForm && (
              <button className="add-btn" onClick={() => setShowGoalForm(true)}>
                <FiPlus size={13} /> New Goal
              </button>
            )}
          </div>

          <div className="goals-grid">
            {showGoalForm && (
              <AddGoalForm
                onAdd={handleAddGoal}
                onCancel={() => setShowGoalForm(false)}
              />
            )}
            {goals.length === 0 && !showGoalForm ? (
              <div className="goals-empty">
                <span>🎯</span>
                No goals yet — set a spending limit to start tracking.
              </div>
            ) : (
              goals.map(g => (
                <GoalCard key={g.id} goal={g} onDelete={handleDeleteGoal} />
              ))
            )}
          </div>
        </div>

        {/* ── MANUAL TRANSACTION ──────────────────────────── */}
        <ManualTransactionForm onAdd={handleAdd} />

        {/* ── TRANSACTIONS TABLE ──────────────────────────── */}
        <div className="table-card">
          <div className="table-header">
            <div>
              <div className="table-title">Recent Transactions</div>
              <div className="table-sub">Entries from your statement</div>
            </div>
            <span className="table-tag">{transactions.length} transactions</span>
          </div>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Amount</th>
                <th>Type</th>
                <th>Category</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx, i) => (
                <tr key={i}>
                  <td>{tx.date}</td>
                  <td className="td-desc">{tx.desc}</td>
                  <td className={tx.type === 'income' ? 'amount-positive' : 'amount-negative'}>
                    {tx.type === 'income' ? `+$${tx.amount}` : `-$${Math.abs(tx.amount)}`}
                  </td>
                  <td>
                    <span className={`badge ${tx.type === 'income' ? 'badge-income' : 'badge-expense'}`}>
                      {tx.type === 'income' ? 'Income' : 'Expense'}
                    </span>
                  </td>
                  <td>{tx.category?.length > 0 ? tx.category : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </main>
    </>
  )
}