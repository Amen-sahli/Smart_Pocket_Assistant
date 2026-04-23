import { useState } from 'react'
import { FiUploadCloud, FiTrendingUp, FiTrendingDown, FiDollarSign } from 'react-icons/fi'
import upload from '../../api/upload'
import { useEffect } from "react";
import  getTransactions  from "../../api/transactions"

//const transactions = [
//  { date: '2026-04-01', desc: 'Monthly Salary', amount: '+$3,000', type: 'income' },
//  { date: '2026-04-02', desc: 'Grocery Store', amount: '-$150', type: 'expense' },
//  { date: '2026-04-03', desc: 'Electricity Bill', amount: '-$80', type: 'expense' },
//  { date: '2026-04-05', desc: 'Freelance Payment', amount: '+$1,200', type: 'income' },
//  { date: '2026-04-06', desc: 'Internet Service', amount: '-$45', type: 'expense' },
//]


export default function DashContent() {

    const [transactions, setTransactions] = useState([])
    const [file, setFile] = useState(null)


  useEffect(() => {
      const token = localStorage.getItem("token");

      async function fetchData() {
      try {
        const data = await getTransactions(token);
        setTransactions(data);
      } catch (err) {
         console.error(err);
      }
      }

  fetchData();
}, []);




    async function handleUpload() {
    const token = localStorage.getItem("token");
    
    try {
      await upload(file, token);
      alert("Upload successful!");
      setFile(null);
      const data = await getTransactions(token);
      setTransactions(data);

    } catch (error) {
      alert(error.message);
    }
  };


    return(
        <main className="db-content">

            {/* UPLOAD */}
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
                  <input
                    type="file"
                    className="file-input"
                    accept=".csv,.pdf"
                    onChange={(e) => setFile(e.target.files[0] || null)}
                  />
                </label>
                <button className="upload-btn" onClick={handleUpload}>
                  <FiUploadCloud size={14} /> Upload
                </button>
              </div>
            </div>

            {/* STATS */}
            <div className="stat-grid">
              <div className="stat-card blue">
                <div className="stat-label">
                  <div className="stat-icon blue"><FiDollarSign /></div>
                  Total Balance
                </div>
                <div className="stat-value">$12,500</div>
                <div className="stat-change neutral">As of this month</div>
              </div>
              <div className="stat-card green">
                <div className="stat-label">
                  <div className="stat-icon green"><FiTrendingUp /></div>
                  Total Income
                </div>
                <div className="stat-value">$4,200</div>
                <div className="stat-change up">↑ 8.2% from last month</div>
              </div>
              <div className="stat-card red">
                <div className="stat-label">
                  <div className="stat-icon red"><FiTrendingDown /></div>
                  Total Expenses
                </div>
                <div className="stat-value">$2,100</div>
                <div className="stat-change down">↑ 3.4% from last month</div>
              </div>
            </div>

            {/* TRANSACTIONS TABLE */}
            <div className="table-card">
              <div className="table-header">
                <div>
                  <div className="table-title">Recent Transactions</div>
                  <div className="table-sub">Last 5 entries from your statement</div>
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
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx, i) => (
                    <tr key={i}>
                      <td>{tx.date}</td>
                      <td className="td-desc">{tx.desc}</td>
                      <td className={tx.type === 'income' ? 'amount-positive' : 'amount-negative'}>
                        {tx.amount > 0 ? `+$${tx.amount}` : `-$${Math.abs(tx.amount)}`}
                      </td>
                      <td>
                        <span className={`badge ${tx.type === 'income' ? 'badge-income' : 'badge-expense'}`}>
                          {tx.type === 'income' ? 'Income' : 'Expense'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </main>
    )
}