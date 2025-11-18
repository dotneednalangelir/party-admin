import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { jobService } from '../../../services/JobService'
import { Job, JobStatus } from '../../../types/api'
import styles from './JobsList.module.css'

function JobsList() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    fetchPendingJobs()
  }, [])

  const fetchPendingJobs = async () => {
    try {
      setLoading(true)
      setError('')
      const response = await jobService.getJobs({
        jobStatus: JobStatus.WaitingApprove,
        pageIndex: 0,
        pageSize: 100,
      })

      setJobs(response.data.items)
    } catch (err: any) {
      setError(err.message || 'İşler yüklenirken bir hata oluştu.')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '-'
    const date = new Date(dateStr)
    return date.toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
    }).format(price)
  }

  const getJobDefinitionName = (translations: Record<string, string>) => {
    return translations['tr'] || translations['en'] || Object.values(translations)[0] || '-'
  }

  const handleRowClick = (jobId: string) => {
    navigate(`/panel/jobs/${jobId}`)
  }

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <p>İşler yükleniyor...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.errorContainer}>
          <p className={styles.errorText}>{error}</p>
          <button onClick={fetchPendingJobs} className={styles.retryButton}>
            Tekrar Dene
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Onay Bekleyen İşler</h2>
        <button onClick={fetchPendingJobs} className={styles.refreshButton}>
          Yenile
        </button>
      </div>

      {jobs.length === 0 ? (
        <div className={styles.emptyState}>
          <p>Onay bekleyen iş bulunmuyor.</p>
        </div>
      ) : (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Plan Adı</th>
                <th>Pozisyon</th>
                <th>İşveren</th>
                <th>Personel Sayısı</th>
                <th>Saatlik Ücret</th>
                <th>Başlangıç</th>
                <th>Bitiş</th>
                <th>Adres</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr
                  key={job.id}
                  onClick={() => handleRowClick(job.id)}
                  className={styles.tableRow}
                >
                  <td className={styles.titleCell}>{job.planName}</td>
                  <td>{getJobDefinitionName(job.jobDefinationTranslations)}</td>
                  <td>{job.tenantName}</td>
                  <td>{job.personnelNeedCount}</td>
                  <td>{formatPrice(job.hourlyPrice)}</td>
                  <td>{formatDate(job.workStartDate)}</td>
                  <td>{formatDate(job.workEndDate)}</td>
                  <td className={styles.addressCell}>{job.addressTitle}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className={styles.stats}>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{jobs.length}</div>
          <div className={styles.statLabel}>Onay Bekleyen İş</div>
        </div>
      </div>
    </div>
  )
}

export default JobsList
