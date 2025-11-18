import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { jobService } from '../../../services/JobService'
import { Job, JobStatus } from '../../../types/api'
import styles from './JobDetail.module.css'

function JobDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [job, setJob] = useState<Job | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [approving, setApproving] = useState(false)

  useEffect(() => {
    if (id) {
      fetchJobDetail(id)
    }
  }, [id])

  const fetchJobDetail = async (jobId: string) => {
    try {
      setLoading(true)
      setError('')
      const response = await jobService.getJobById(jobId)
      setJob(response.data)
    } catch (err: any) {
      setError(err.message || 'İş detayları yüklenirken bir hata oluştu.')
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async () => {
    if (!job || !id) return

    if (!window.confirm('Bu işi onaylamak istediğinizden emin misiniz?')) {
      return
    }

    try {
      setApproving(true)
      await jobService.updateJobStatus(id, JobStatus.Approved)
      alert('İş başarıyla onaylandı!')
      navigate('/panel/jobs')
    } catch (err: any) {
      alert(err.message || 'İş onaylanırken bir hata oluştu.')
    } finally {
      setApproving(false)
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

  const getTagName = (tagNames: Record<string, string>) => {
    return tagNames['tr'] || tagNames['en'] || Object.values(tagNames)[0] || '-'
  }

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <p>İş detayları yükleniyor...</p>
        </div>
      </div>
    )
  }

  if (error || !job) {
    return (
      <div className={styles.container}>
        <div className={styles.errorContainer}>
          <p className={styles.errorText}>{error || 'İş bulunamadı.'}</p>
          <button onClick={() => navigate('/panel/jobs')} className={styles.backButton}>
            Geri Dön
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button onClick={() => navigate('/panel/jobs')} className={styles.backButton}>
          ← Geri
        </button>
        <h2>İş Detayı</h2>
      </div>

      <div className={styles.content}>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3>Genel Bilgiler</h3>
            <span className={styles.statusBadge}>Onay Bekliyor</span>
          </div>

          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <label>Plan Adı</label>
              <p>{job.planName}</p>
            </div>
            <div className={styles.infoItem}>
              <label>Pozisyon</label>
              <p>{getJobDefinitionName(job.jobDefinationTranslations)}</p>
            </div>
            <div className={styles.infoItem}>
              <label>İşveren</label>
              <p>{job.tenantName}</p>
            </div>
            <div className={styles.infoItem}>
              <label>Personel Sayısı</label>
              <p>{job.personnelNeedCount} Kişi</p>
            </div>
            <div className={styles.infoItem}>
              <label>Saatlik Ücret</label>
              <p>{formatPrice(job.hourlyPrice)}</p>
            </div>
            <div className={styles.infoItem}>
              <label>Başvuru Sayısı</label>
              <p>{job.applicationCount}</p>
            </div>
            <div className={styles.infoItem}>
              <label>Onaylanan Başvuru</label>
              <p>{job.approvedApplicationCount}</p>
            </div>
            <div className={styles.infoItem}>
              <label>Oluşturulma Tarihi</label>
              <p>{formatDate(job.createdTime)}</p>
            </div>
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3>Zaman Bilgileri</h3>
          </div>
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <label>İş Başlangıcı</label>
              <p>{formatDate(job.workStartDate)}</p>
            </div>
            <div className={styles.infoItem}>
              <label>İş Bitişi</label>
              <p>{formatDate(job.workEndDate)}</p>
            </div>
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3>Konum Bilgileri</h3>
          </div>
          <div className={styles.infoGrid}>
            <div className={styles.infoItem} style={{ gridColumn: '1 / -1' }}>
              <label>Adres</label>
              <p>{job.addressTitle}</p>
            </div>
            {job.latitude && job.longitude && (
              <>
                <div className={styles.infoItem}>
                  <label>Koordinatlar</label>
                  <p>{job.latitude}, {job.longitude}</p>
                </div>
                {job.distance > 0 && (
                  <div className={styles.infoItem}>
                    <label>Mesafe</label>
                    <p>{(job.distance / 1000).toFixed(2)} km</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {job.jobTagInfos && job.jobTagInfos.length > 0 && (
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h3>Etiketler</h3>
            </div>
            <div className={styles.tags}>
              {job.jobTagInfos.map((tag) => (
                <span key={tag.tagId} className={styles.tag}>
                  {getTagName(tag.tagNames)}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className={styles.actions}>
          <button
            onClick={handleApprove}
            className={styles.approveButton}
            disabled={approving}
          >
            {approving ? 'Onaylanıyor...' : 'İşi Onayla'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default JobDetail
