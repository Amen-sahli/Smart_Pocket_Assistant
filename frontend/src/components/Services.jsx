import { FiUploadCloud, FiBarChart2, FiCpu,  FiShield } from 'react-icons/fi' 

export default function Services() {
    return(
        <section id="services" className="hp-services">
                  <div className="section-label">What we offer</div>
                  <h2 className="section-title">
                    Everything you need to understand your <span>money</span>
                  </h2>
                  <p className="section-sub">
                    From simple uploads to deep analysis, BankAnalyzer gives you the tools to make sense of every transaction.
                  </p>
        
                  <div className="services-grid">
                    {[
                      {
                        icon: <FiUploadCloud />,
                        title: 'Upload Statements',
                        desc: 'Drag and drop your CSV or PDF bank statements. We parse and organize everything automatically.',
                      },
                      {
                        icon: <FiBarChart2 />,
                        title: 'Visual Analytics',
                        desc: 'Interactive charts to visualize your spending, income streams, and financial trends over time.',
                      },
                      {
                        icon: <FiCpu />,
                        title: 'Smart Insights',
                        desc: 'AI-powered analysis that categorizes transactions and highlights unusual patterns for you.',
                      },
                      {
                        icon: <FiShield />,
                        title: 'Private & Secure',
                        desc: 'Your data never leaves your control. We prioritize privacy with end-to-end security.',
                      },
                      {
                        icon: <FiBarChart2 />,
                        title: 'Export Reports',
                        desc: 'Generate clean PDF or CSV reports summarizing your financial health for any period.',
                      },
                      {
                        icon: <FiUploadCloud />,
                        title: 'Multi-Account',
                        desc: 'Connect and compare multiple bank accounts side-by-side in one unified dashboard.',
                      },
                    ].map((s, i) => (
                      <div className="service-card" key={i}>
                        <div className="service-icon">{s.icon}</div>
                        <div className="service-title">{s.title}</div>
                        <div className="service-desc">{s.desc}</div>
                      </div>
                    ))}
                  </div>
                </section>
    )
}