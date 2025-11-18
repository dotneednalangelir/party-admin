import { Routes, Route, Navigate } from 'react-router-dom'
import JobsList from './jobs/JobsList'
import JobDetail from './jobs/JobDetail'
import styles from './Panel.module.css'

interface PanelProps {
  onLogout: () => void
}

function Panel({ onLogout }: PanelProps) {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1>İş Onay Paneli</h1>
          <button onClick={onLogout} className={styles.logoutButton}>
            Çıkış Yap
          </button>
        </div>
      </header>

      <main className={styles.main}>
        <Routes>
          <Route path="/" element={<Navigate to="/panel/jobs" replace />} />
          <Route path="/jobs" element={<JobsList />} />
          <Route path="/jobs/:id" element={<JobDetail />} />
        </Routes>
      </main>
    </div>
  )
}

export default Panel
