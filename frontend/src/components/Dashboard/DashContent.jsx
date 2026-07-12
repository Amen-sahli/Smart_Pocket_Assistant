import { useState, useEffect } from 'react'
import {
  FiUploadCloud, FiTrendingUp, FiTrendingDown, FiDollarSign,
  FiPlus, FiTrash2, FiCheck, FiX, FiEdit3,
  FiGrid, FiDownload, FiTarget, FiAlertCircle, FiCheckCircle,
  FiArrowLeft, FiSearch, FiChevronRight
} from 'react-icons/fi'
import upload from '../../api/upload'
import getTransactions, { getStats, getAllTransactions } from '../../api/transactions'
import '../../styles/goals.css'
import { addTransaction } from "../../api/transactions";

const CATEGORIES = ['Food', 'Transport', 'Bills', 'Shopping', 'Health', 'Housing', 'Entertainment', 'Salary', 'Freelance', 'Others']
const PERIODS    = ['1 week', '2 weeks', '1 month', '3 months', '6 months', '1 year']
const CAT_ICONS  = { Food:'🍽️', Transport:'🚗', Bills:'📄', Shopping:'🛍️', Health:'💊', Housing:'🏠', Entertainment:'🎬', Salary:'💼', Freelance:'💻', Others:'📦' }

const TABS = [
  { key: 'overview', label: 'Overview', icon: FiGrid },
  { key: 'import',   label: 'Import',   icon: FiDownload },
  { key: 'goals',    label: 'Goals',    icon: FiTarget },
]

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
        <span className="goal-limit-label">limit</span>
      </div>
      <div className="goal-period">over {goal.period}</div>
      <div className="goal-progress-wrap">
        <div className="goal-progress-label">
          <span>Spent: ${(goal.spent || 0).toLocaleString()}</span>
          <span className={over ? 'over-text' : ''}>{pct.toFixed(0)}%{over ? ' — over!' : ''}</span>
        </div>
        <div className="goal-progress-track">
          <div className={`goal-progress-fill ${over ? 'over' : ''}`} style={{ width:`${pct}%` }} />
        </div>
      </div>
    </div>
  )
}

function AddGoalForm({ onAdd, onCancel }) {
  const [form, setForm] = useState({ amount:'', period:'1 month', category:'Food' })
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = () => {
    if (!form.amount || isNaN(Number(form.amount))) return
    onAdd({ id: Date.now(), ...form, amount: Number(form.amount), spent: 0 })
  }

  return (
    <div className="add-goal-card">
      <div className="add-goal-title">New Spending Goal</div>
      <div className="form-row">
        <div className="form-field">
          <label className="form-label">Limit Amount ($)</label>
          <input className="form-input" type="number" placeholder="e.g. 300" value={form.amount} onChange={e => set('amount', e.target.value)} />
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

function ManualTransactionForm({ onAdd, feedback, setFeedback, submitting }) {
  const today = new Date().toISOString().split('T')[0]
  const [form, setForm] = useState({ date: today, desc: '', amount: '', type: 'expense', category: 'Food' })
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = () => {
    if (!form.desc || !form.amount || isNaN(Number(form.amount))) {
      setFeedback({ type:'error', text:'Please fill in description and a valid amount.' })
      setTimeout(() => setFeedback(null), 4000)
      return
    }
    setFeedback(null)
    onAdd({ ...form, amount: Number(form.amount) })
    setForm({ date: today, desc:'', amount:'', type:'expense', category:'Food' })
  }

  return (
    <div className="tx-manual-card">
      <div className="tx-manual-header">
        <div className="tx-manual-header-left">
          <div className="section-icon"><FiEdit3 size={14}/></div>
          <div>
            <div className="section-title">Add Transaction</div>
            <div className="section-sub">Log a transaction that isn't in your statement</div>
          </div>
        </div>
      </div>

      <div className="tx-manual-body">
        <div className="form-field">
          <label className="form-label">Type</label>
          <select className="form-select" value={form.type} onChange={e => set('type', e.target.value)}>
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
        </div>
        <div className="form-field">
          <label className="form-label">Date</label>
          <input className="form-input" type="date" value={form.date} onChange={e => set('date', e.target.value)} style={{ colorScheme:'dark' }} />
        </div>
        <div className="form-field">
          <label className="form-label">Amount ($)</label>
          <input className="form-input" type="number" placeholder="0.00" value={form.amount} onChange={e => set('amount', e.target.value)} />
        </div>
        <div className="form-field">
          <label className="form-label">Category</label>
          <select className="form-select" value={form.category} onChange={e => set('category', e.target.value)}>
            {CATEGORIES.map(c => <option key={c} value={c}>{CAT_ICONS[c]} {c}</option>)}
          </select>
        </div>
        <div className="form-field" style={{ gridColumn:'1/-1' }}>
          <label className="form-label">Description</label>
          <input className="form-input" type="text" placeholder="e.g. Grocery run at Carrefour" value={form.desc} onChange={e => set('desc', e.target.value)} />
        </div>
        <div className="tx-submit-row">
          {feedback && (
            <div className={`tx-feedback ${feedback.type}`}>
              {feedback.type === 'success' ? <FiCheckCircle size={14}/> : <FiAlertCircle size={14}/>}
              {feedback.text}
            </div>
          )}
          <button className="tx-submit-btn" onClick={handleSubmit} disabled={submitting}>
            <FiPlus size={15}/> {submitting ? 'Adding...' : 'Add Transaction'}
          </button>
        </div>
      </div>
    </div>
  )
}

function OverviewTab({ stats, transactions, onMore }) {
  const formatMoney = (num) => Number(num || 0).toLocaleString()

  return (
    <>
      <div className="stat-grid">
        <div className="stat-card blue">
          <div className="stat-label"><div className="stat-icon blue"><FiDollarSign /></div>Total Balance</div>
          <div className="stat-value">${stats.balance > 0 ? formatMoney(stats.balance) : '0.00'}</div>
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

      <div className="table-card">
        <div className="table-header">
          <div>
            <div className="table-title">Recent Transactions</div>
            <div className="table-sub">Entries from your statement</div>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            <span className="table-tag">{transactions.length} transactions</span>
            <button className="more-btn" onClick={onMore}>
              More... <FiChevronRight size={14} />
            </button>
          </div>
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
    </>
  )
}

function AllTransactions({ onBack }) {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    async function fetchAll() {
      try {
        const data = await getAllTransactions()
        setTransactions(data)
      } catch { /* handled by authFetch */ }
      setLoading(false)
    }
    fetchAll()
  }, [])

  const filtered = transactions.filter(tx => {
    const matchSearch = !search ||
      tx.desc?.toLowerCase().includes(search.toLowerCase()) ||
      tx.category?.toLowerCase().includes(search.toLowerCase()) ||
      tx.date?.toString().includes(search)
    const matchType = filter === 'all' || tx.type === filter
    return matchSearch && matchType
  })

  return (
    <div className="table-card">
      <div className="table-header">
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <button className="back-btn" onClick={onBack}>
            <FiArrowLeft size={15} />
          </button>
          <div>
            <div className="table-title">All Transactions</div>
            <div className="table-sub">{filtered.length} of {transactions.length} transactions</div>
          </div>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <div className="search-wrap">
            <FiSearch size={14} />
            <input
              className="search-input"
              type="text"
              placeholder="Search..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <select className="filter-select" value={filter} onChange={e => setFilter(e.target.value)}>
            <option value="all">All</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="tx-loading">Loading...</div>
      ) : filtered.length === 0 ? (
        <div className="tx-empty">
          <span>📭</span> No transactions found.
        </div>
      ) : (
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
            {filtered.map((tx) => (
              <tr key={tx.id}>
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
      )}
    </div>
  )
}

function ImportTab({ file, setFile, handleUpload, handleAdd, feedback, setFeedback, submitting }) {
  return (
    <>
      <div className="upload-card">
        <div className="upload-left">
          <div className="upload-icon-wrap"><FiUploadCloud /></div>
          <div>
            <div className="upload-title">Upload Bank Statement</div>
            <div className="upload-sub">Upload a PDF bank statement to auto-import your transactions</div>
          </div>
        </div>
        <div className="upload-right">
          <label className="file-input-label">
            <FiUploadCloud size={14} />
            {file?.name ? 'Change file' : 'Browse file'}
            <input type="file" className="file-input" accept=".csv,.pdf" onChange={e => setFile(e.target.files[0] || null)} />
          </label>
          <button className="upload-btn" onClick={handleUpload} disabled={!file}>
            <FiUploadCloud size={14} /> Upload
          </button>
        </div>
      </div>

      

      <ManualTransactionForm onAdd={handleAdd} feedback={feedback} setFeedback={setFeedback} submitting={submitting} />
    </>
  )
}

function GoalsTab({ goals, handleAddGoal, handleDeleteGoal, showGoalForm, setShowGoalForm }) {
  return (
    <div className="goals-section">
      <div className="section-header">
        <div className="section-title-wrap">
          <div>
            <div className="section-title">Spending Goals</div>
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
          <AddGoalForm onAdd={handleAddGoal} onCancel={() => setShowGoalForm(false)} />
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
  )
}

export default function DashContent() {
  const [section, setSection] = useState('overview')
  const [stats, setStats] = useState({ balance:0, income:0, expenses:0 })
  const [transactions, setTransactions] = useState([])
  const [file, setFile] = useState(null)
  const [goals, setGoals] = useState([
    { id:1, amount:300, period:'1 month', category:'Food',      spent:210 },
    { id:2, amount:150, period:'1 month', category:'Transport', spent:60  },
    { id:3, amount:500, period:'3 months',category:'Shopping',  spent:520 },
  ])
  const [showGoalForm, setShowGoalForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [feedback, setFeedback] = useState(null)
  const [viewAll, setViewAll] = useState(false)

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getTransactions()
        const statsData = await getStats()
        setStats(statsData)
        setTransactions(data)
      } catch {
        setFeedback({ type:'error', text:'Failed to load data. Please try again.' })
        setTimeout(() => setFeedback(null), 5000)
      }
    }
    fetchData()
  }, [])

  async function handleUpload() {
    setFeedback(null)
    try {
      await upload(file)
      setFeedback({ type:'success', text:'Upload successful!' })
      setTimeout(() => setFeedback(null), 3000)
      setFile(null)
      const data = await getTransactions()
      const statsData = await getStats()
      setTransactions(data)
      setStats(statsData)
    } catch (error) {
      setFeedback({ type:'error', text: error.message })
      setTimeout(() => setFeedback(null), 5000)
    }
  }

  function handleAddGoal(goal) {
    setGoals(g => [...g, goal])
    setShowGoalForm(false)
  }

  function handleDeleteGoal(id) {
    setGoals(g => g.filter(x => x.id !== id))
  }

  async function handleAdd(tx) {
    setSubmitting(true)
    try {
      await addTransaction(tx)
      const [txList, statsData] = await Promise.all([
        getTransactions(),
        getStats()
      ])
      setTransactions(txList)
      setStats(statsData)
      setFeedback({ type:'success', text:'Transaction added successfully' })
      setTimeout(() => setFeedback(null), 3000)
      setSection('overview')
    } catch (err) {
      setFeedback({ type:'error', text: err.message })
      setTimeout(() => setFeedback(null), 5000)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="db-content">
      <div className="dash-tabs">
        {TABS.map(tab => {
          const Icon = tab.icon
          return (
            <button
              key={tab.key}
              className={`dash-tab ${section === tab.key ? 'active' : ''}`}
              onClick={() => setSection(tab.key)}
            >
              <Icon size={14} />
              {tab.label}
            </button>
          )
        })}
      </div>

      {section === 'overview' && (
        viewAll
          ? <AllTransactions onBack={() => setViewAll(false)} />
          : <OverviewTab stats={stats} transactions={transactions} onMore={() => setViewAll(true)} />
      )}

      {section === 'import' && (
        <ImportTab file={file} setFile={setFile} handleUpload={handleUpload} handleAdd={handleAdd} feedback={feedback} setFeedback={setFeedback} submitting={submitting} />
      )}

      {section === 'goals' && (
        <GoalsTab
          goals={goals}
          handleAddGoal={handleAddGoal}
          handleDeleteGoal={handleDeleteGoal}
          showGoalForm={showGoalForm}
          setShowGoalForm={setShowGoalForm}
        />
      )}
    </main>
  )
}
