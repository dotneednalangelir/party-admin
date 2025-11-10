import { useState, useEffect, useRef } from 'react'
import styles from './Panel.module.css'

interface Shift {
  jobId: string
  date: string
  startTime: string
  endTime: string
}

interface JobTagInfo {
  tagId: string
  tagNames: Record<string, string>
}

interface Job {
  jobPlanId: string
  jobDefinitionId: string
  jobDefinitionName: string
  tenantName: string
  personnelNeedCount: number
  tags: JobTagInfo[]
  addressTitle: string
  addressDescription: string
  notes: string
  hourlyPrice: number
  requirements?: Record<string, string>
  latitude: number
  longitude: number
  applicationEndTime: string
  shifts: Shift[]
}

interface JobPlan {
  id: number
  title: string
  sectorId: string
  sectorName: string
  createdDate: string
  jobs: Job[]
}

interface ListingsProps {
  onLogout: () => void
  userEmail?: string
}

// Mock data - replace with real API data
const mockJobPlans: JobPlan[] = [
  {
    id: 1,
    title: 'Yaz Partisi 2024',
    sectorId: '1',
    sectorName: 'Açık Hava Etkinlikleri',
    createdDate: '15.07.2024',
    jobs: [
      {
        jobPlanId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        jobDefinitionId: '3fa85f64-5717-4562-b3fc-2c963f66afa7',
        jobDefinitionName: 'Etkinlik Koordinatörü',
        tenantName: 'ABC Organizasyon',
        personnelNeedCount: 5,
        tags: [
          {
            tagId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
            tagNames: { 'tr': 'Etkinlik Yönetimi', 'en': 'Event Management' }
          },
          {
            tagId: '4fa85f64-5717-4562-b3fc-2c963f66afa7',
            tagNames: { 'tr': 'Sahne Kurulumu', 'en': 'Stage Setup' }
          }
        ],
        addressTitle: 'Ana Etkinlik Alanı',
        addressDescription: 'Kadıköy Sahil, İstanbul',
        notes: 'Parti ekipmanı kurulumu ve gözetimi',
        hourlyPrice: 150.0,
        requirements: { deneyim: '2 yıl', sertifika: 'Etkinlik Yönetimi' },
        latitude: 40.9897,
        longitude: 29.0244,
        applicationEndTime: '2024-07-10T23:59:59Z',
        shifts: [
          {
            jobId: '00000000-0000-0000-0000-000000000001',
            date: '2024-07-15T00:00:00Z',
            startTime: '14:00:00',
            endTime: '23:00:00'
          }
        ]
      },
      {
        jobPlanId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        jobDefinitionId: '3fa85f64-5717-4562-b3fc-2c963f66afa8',
        jobDefinitionName: 'Catering Personeli',
        tenantName: 'ABC Organizasyon',
        personnelNeedCount: 3,
        tags: [
          {
            tagId: '5fa85f64-5717-4562-b3fc-2c963f66afa8',
            tagNames: { 'tr': 'Catering', 'en': 'Catering' }
          },
          {
            tagId: '6fa85f64-5717-4562-b3fc-2c963f66afa9',
            tagNames: { 'tr': 'Servis', 'en': 'Service' }
          }
        ],
        addressTitle: 'Catering Alanı',
        addressDescription: 'Kadıköy Sahil, İstanbul',
        notes: 'Yemek servisi ve içecek hazırlığı',
        hourlyPrice: 120.0,
        latitude: 40.9897,
        longitude: 29.0244,
        applicationEndTime: '2024-07-10T23:59:59Z',
        shifts: [
          {
            jobId: '00000000-0000-0000-0000-000000000002',
            date: '2024-07-15T00:00:00Z',
            startTime: '13:00:00',
            endTime: '22:00:00'
          }
        ]
      }
    ]
  },
  {
    id: 2,
    title: 'Elektronik Müzik Festivali',
    sectorId: '2',
    sectorName: 'Müzik ve Eğlence',
    createdDate: '22.08.2024',
    jobs: [
      {
        jobPlanId: '4fa85f64-5717-4562-b3fc-2c963f66afa6',
        jobDefinitionId: '4fa85f64-5717-4562-b3fc-2c963f66afa7',
        jobDefinitionName: 'Ses Teknisyeni',
        tenantName: 'XYZ Etkinlik',
        personnelNeedCount: 10,
        tags: [
          {
            tagId: '7fa85f64-5717-4562-b3fc-2c963f66afa10',
            tagNames: { 'tr': 'Ses Sistemi', 'en': 'Sound System' }
          },
          {
            tagId: '8fa85f64-5717-4562-b3fc-2c963f66afa11',
            tagNames: { 'tr': 'Sahne Kurulumu', 'en': 'Stage Setup' }
          }
        ],
        addressTitle: 'Festival Alanı',
        addressDescription: 'Çankaya Park, Ankara',
        notes: 'Sahne kurulumu ve ses sistemi yönetimi',
        hourlyPrice: 200.0,
        requirements: { deneyim: '3 yıl', sertifika: 'Ses Teknisyeni' },
        latitude: 39.9334,
        longitude: 32.8597,
        applicationEndTime: '2024-08-15T23:59:59Z',
        shifts: [
          {
            jobId: '00000000-0000-0000-0000-000000000003',
            date: '2024-08-22T00:00:00Z',
            startTime: '10:00:00',
            endTime: '02:00:00'
          }
        ]
      }
    ]
  },
  {
    id: 3,
    title: 'Şirket Yılbaşı Partisi',
    sectorId: '3',
    sectorName: 'Kurumsal Etkinlikler',
    createdDate: '31.12.2024',
    jobs: [
      {
        jobPlanId: '5fa85f64-5717-4562-b3fc-2c963f66afa6',
        jobDefinitionId: '5fa85f64-5717-4562-b3fc-2c963f66afa7',
        jobDefinitionName: 'Etkinlik Organizatörü',
        tenantName: 'Tech Corp.',
        personnelNeedCount: 8,
        tags: [
          {
            tagId: '9fa85f64-5717-4562-b3fc-2c963f66afa12',
            tagNames: { 'tr': 'Kurumsal', 'en': 'Corporate' }
          },
          {
            tagId: '10fa85f64-5717-4562-b3fc-2c963f66afa13',
            tagNames: { 'tr': 'Organizasyon', 'en': 'Organization' }
          }
        ],
        addressTitle: 'Şirket Merkezi',
        addressDescription: 'Konak İş Merkezi, İzmir',
        notes: 'Kurumsal etkinlik organizasyonu',
        hourlyPrice: 180.0,
        latitude: 38.4237,
        longitude: 27.1428,
        applicationEndTime: '2024-12-25T23:59:59Z',
        shifts: [
          {
            jobId: '00000000-0000-0000-0000-000000000004',
            date: '2024-12-31T00:00:00Z',
            startTime: '18:00:00',
            endTime: '02:00:00'
          }
        ]
      }
    ]
  },
  {
    id: 4,
    title: 'Doğum Günü Kutlaması',
    sectorId: '4',
    sectorName: 'Özel Etkinlikler',
    createdDate: '05.06.2024',
    jobs: [
      {
        jobPlanId: '6fa85f64-5717-4562-b3fc-2c963f66afa6',
        jobDefinitionId: '6fa85f64-5717-4562-b3fc-2c963f66afa7',
        jobDefinitionName: 'Dekorasyon Görevlisi',
        tenantName: 'Kişisel Etkinlik',
        personnelNeedCount: 2,
        tags: [
          {
            tagId: '11fa85f64-5717-4562-b3fc-2c963f66afa14',
            tagNames: { 'tr': 'Dekorasyon', 'en': 'Decoration' }
          },
          {
            tagId: '12fa85f64-5717-4562-b3fc-2c963f66afa15',
            tagNames: { 'tr': 'Servis', 'en': 'Service' }
          }
        ],
        addressTitle: 'Özel Konut',
        addressDescription: 'Nilüfer, Bursa',
        notes: 'Dekorasyon ve ikram servisi',
        hourlyPrice: 100.0,
        latitude: 40.1885,
        longitude: 29.0663,
        applicationEndTime: '2024-06-01T23:59:59Z',
        shifts: [
          {
            jobId: '00000000-0000-0000-0000-000000000005',
            date: '2024-06-05T00:00:00Z',
            startTime: '15:00:00',
            endTime: '21:00:00'
          }
        ]
      }
    ]
  },
  {
    id: 5,
    title: 'Rock Konseri',
    sectorId: '2',
    sectorName: 'Müzik ve Eğlence',
    createdDate: '18.09.2024',
    jobs: [
      {
        jobPlanId: '7fa85f64-5717-4562-b3fc-2c963f66afa6',
        jobDefinitionId: '7fa85f64-5717-4562-b3fc-2c963f66afa7',
        jobDefinitionName: 'Sahne Yöneticisi',
        tenantName: 'Rock Müzik Ltd.',
        personnelNeedCount: 6,
        tags: [
          {
            tagId: '13fa85f64-5717-4562-b3fc-2c963f66afa16',
            tagNames: { 'tr': 'Sahne Yönetimi', 'en': 'Stage Management' }
          },
          {
            tagId: '14fa85f64-5717-4562-b3fc-2c963f66afa17',
            tagNames: { 'tr': 'Teknik Destek', 'en': 'Technical Support' }
          }
        ],
        addressTitle: 'Konser Salonu',
        addressDescription: 'Muratpaşa, Antalya',
        notes: 'Sahne yönetimi ve teknik destek',
        hourlyPrice: 175.0,
        requirements: { deneyim: '2 yıl' },
        latitude: 36.8969,
        longitude: 30.7133,
        applicationEndTime: '2024-09-10T23:59:59Z',
        shifts: [
          {
            jobId: '00000000-0000-0000-0000-000000000006',
            date: '2024-09-18T00:00:00Z',
            startTime: '17:00:00',
            endTime: '23:00:00'
          }
        ]
      }
    ]
  }
]

function Listings({ onLogout, userEmail = 'nalangelir@dotneed.io' }: ListingsProps) {
  const [jobPlans] = useState<JobPlan[]>(mockJobPlans)
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set())
  const profileRef = useRef<HTMLDivElement>(null)

  const toggleRow = (id: number) => {
    const newExpandedRows = new Set(expandedRows)
    if (newExpandedRows.has(id)) {
      newExpandedRows.delete(id)
    } else {
      newExpandedRows.add(id)
    }
    setExpandedRows(newExpandedRows)
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileModalOpen(false)
      }
    }

    if (isProfileModalOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isProfileModalOpen])

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1>İlan Yönetim Paneli</h1>
          <div className={styles.profileWrapper} ref={profileRef}>
            <button
              onClick={() => setIsProfileModalOpen(!isProfileModalOpen)}
              className={styles.profileButton}
              aria-label="Profil"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </button>
            {isProfileModalOpen && (
              <div className={styles.profileDropdown}>
                <div className={styles.dropdownHeader}>
                  <div className={styles.userEmailSmall}>{userEmail}</div>
                </div>
                <div className={styles.dropdownDivider}></div>
                <button onClick={onLogout} className={styles.dropdownLogoutButton}>
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                    <polyline points="16 17 21 12 16 7"></polyline>
                    <line x1="21" y1="12" x2="9" y2="12"></line>
                  </svg>
                  Çıkış Yap
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th style={{ width: '50px' }}></th>
                <th>İlan Adı</th>
                <th>İşveren</th>
                <th>Sektör</th>
                <th>Oluşturulma Tarihi</th>
              </tr>
            </thead>
            <tbody>
              {jobPlans.length > 0 ? (
                jobPlans.map((jobPlan) => {
                  const tenantDisplay = jobPlan.jobs[0]?.tenantName || '';

                  return (
                  <>
                    <tr key={jobPlan.id} className={styles.mainRow} onClick={() => toggleRow(jobPlan.id)}>
                      <td>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleRow(jobPlan.id);
                          }}
                          className={styles.expandButton}
                          aria-label={expandedRows.has(jobPlan.id) ? 'Daralt' : 'Genişlet'}
                        >
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            style={{
                              transform: expandedRows.has(jobPlan.id) ? 'rotate(90deg)' : 'rotate(0deg)',
                              transition: 'transform 0.2s ease'
                            }}
                          >
                            <polyline points="9 18 15 12 9 6"></polyline>
                          </svg>
                        </button>
                      </td>
                      <td className={styles.titleCell}>{jobPlan.title}</td>
                      <td>{tenantDisplay}</td>
                      <td>{jobPlan.sectorName}</td>
                      <td>{jobPlan.createdDate}</td>
                    </tr>
                    {expandedRows.has(jobPlan.id) && (
                      <tr key={`${jobPlan.id}-expanded`} className={styles.expandedRow}>
                        <td colSpan={5}>
                          <div className={styles.jobCardsContainer}>
                            <div className={styles.jobCards}>
                              {jobPlan.jobs.map((job, index) => (
                                <div key={index} className={styles.jobCard}>
                                  <div className={styles.jobCardHeader}>
                                    <h4>{job.jobDefinitionName}</h4>
                                    <span className={styles.jobCardPrice}>{job.hourlyPrice} ₺/saat</span>
                                  </div>
                                  <div className={styles.jobCardBody}>
                                    <div className={styles.jobCardRow}>
                                      <span className={styles.jobCardLabel}>İşveren:</span>
                                      <span className={styles.tenantName}>{job.tenantName}</span>
                                    </div>
                                    <div className={styles.jobCardRow}>
                                      <span className={styles.jobCardLabel}>Adres Başlığı:</span>
                                      <span>{job.addressTitle}</span>
                                    </div>
                                    <div className={styles.jobCardRow}>
                                      <span className={styles.jobCardLabel}>Adres:</span>
                                      <span>{job.addressDescription}</span>
                                    </div>
                                    <div className={styles.jobCardRow}>
                                      <span className={styles.jobCardLabel}>Personel İhtiyacı:</span>
                                      <span>{job.personnelNeedCount} kişi</span>
                                    </div>
                                    {job.tags.length > 0 && (
                                      <div className={styles.jobCardRow}>
                                        <span className={styles.jobCardLabel}>Etiketler:</span>
                                        <div className={styles.tags}>
                                          {job.tags.map((tag) => (
                                            <span key={tag.tagId} className={styles.tag}>
                                              {tag.tagNames['tr'] || tag.tagNames['en'] || Object.values(tag.tagNames)[0]}
                                            </span>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                    <div className={styles.jobCardRow}>
                                      <span className={styles.jobCardLabel}>Başvuru Bitiş:</span>
                                      <span>{new Date(job.applicationEndTime).toLocaleDateString('tr-TR')}</span>
                                    </div>
                                    {job.shifts.length > 0 && (
                                      <div className={styles.jobCardRow}>
                                        <span className={styles.jobCardLabel}>Vardiyalar:</span>
                                        <div className={styles.shifts}>
                                          {job.shifts.map((shift, shiftIndex) => (
                                            <div key={shiftIndex} className={styles.shift}>
                                              {new Date(shift.date).toLocaleDateString('tr-TR')} - {shift.startTime.slice(0, 5)} / {shift.endTime.slice(0, 5)}
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                    {job.notes && (
                                      <div className={styles.jobCardRow}>
                                        <span className={styles.jobCardLabel}>Notlar:</span>
                                        <span>{job.notes}</span>
                                      </div>
                                    )}
                                    {job.requirements && Object.keys(job.requirements).length > 0 && (
                                      <div className={styles.jobCardRow}>
                                        <span className={styles.jobCardLabel}>Gereksinimler:</span>
                                        <div className={styles.requirements}>
                                          {Object.entries(job.requirements).map(([key, value]) => (
                                            <span key={key} className={styles.requirement}>
                                              {key}: {value}
                                            </span>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                    <div className={styles.jobCardActions}>
                                      <button className={styles.rejectButton}>
                                        Reddet
                                      </button>
                                      <button className={styles.approveButton}>
                                        Onayla
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className={styles.noData}>
                    Sonuç bulunamadı
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}

export default Listings
