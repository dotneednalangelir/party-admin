import { useState } from 'react'
import styles from './Panel.module.css'

interface Listing {
  id: number
  title: string
  category: string
  date: string
  location: string
  status: 'Aktif' | 'Beklemede' | 'Tamamlandı'
  attendees: number
}

interface ListingsProps {
  onLogout: () => void
}

// Mock data - replace with real API data
const mockListings: Listing[] = [
  {
    id: 1,
    title: 'Yaz Partisi 2024',
    category: 'Açık Hava',
    date: '15.07.2024',
    location: 'İstanbul',
    status: 'Aktif',
    attendees: 150
  },
  {
    id: 2,
    title: 'Elektronik Müzik Festivali',
    category: 'Müzik',
    date: '22.08.2024',
    location: 'Ankara',
    status: 'Aktif',
    attendees: 500
  },
  {
    id: 3,
    title: 'Şirket Yılbaşı Partisi',
    category: 'Kurumsal',
    date: '31.12.2024',
    location: 'İzmir',
    status: 'Beklemede',
    attendees: 200
  },
  {
    id: 4,
    title: 'Doğum Günü Kutlaması',
    category: 'Özel',
    date: '05.06.2024',
    location: 'Bursa',
    status: 'Tamamlandı',
    attendees: 80
  },
  {
    id: 5,
    title: 'Rock Konseri',
    category: 'Müzik',
    date: '18.09.2024',
    location: 'Antalya',
    status: 'Aktif',
    attendees: 350
  }
]

type FilterStatus = 'Tümü' | 'Aktif' | 'Beklemede' | 'Tamamlandı'

function Listings({ onLogout }: ListingsProps) {
  const [listings] = useState<Listing[]>(mockListings)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('Tümü')

  const filteredListings = listings.filter(listing => {
    const matchesSearch = listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         listing.location.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === 'Tümü' || listing.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const getStatusClass = (status: Listing['status']) => {
    switch (status) {
      case 'Aktif':
        return styles.statusActive
      case 'Beklemede':
        return styles.statusPending
      case 'Tamamlandı':
        return styles.statusCompleted
      default:
        return ''
    }
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1>İlan Yönetimi</h1>
          <button onClick={onLogout} className={styles.logoutButton}>
            Çıkış Yap
          </button>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.controls}>
          <div className={styles.searchBox}>
            <input
              type="text"
              placeholder="İlan ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>

          <div className={styles.filters}>
            <button
              className={`${styles.filterButton} ${filterStatus === 'Tümü' ? styles.active : ''}`}
              onClick={() => setFilterStatus('Tümü')}
            >
              Tümü
            </button>
            <button
              className={`${styles.filterButton} ${filterStatus === 'Aktif' ? styles.active : ''}`}
              onClick={() => setFilterStatus('Aktif')}
            >
              Aktif
            </button>
            <button
              className={`${styles.filterButton} ${filterStatus === 'Beklemede' ? styles.active : ''}`}
              onClick={() => setFilterStatus('Beklemede')}
            >
              Beklemede
            </button>
            <button
              className={`${styles.filterButton} ${filterStatus === 'Tamamlandı' ? styles.active : ''}`}
              onClick={() => setFilterStatus('Tamamlandı')}
            >
              Tamamlandı
            </button>
          </div>
        </div>

        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Başlık</th>
                <th>Kategori</th>
                <th>Tarih</th>
                <th>Konum</th>
                <th>Katılımcı</th>
                <th>Durum</th>
              </tr>
            </thead>
            <tbody>
              {filteredListings.length > 0 ? (
                filteredListings.map((listing) => (
                  <tr key={listing.id}>
                    <td>{listing.id}</td>
                    <td className={styles.titleCell}>{listing.title}</td>
                    <td>{listing.category}</td>
                    <td>{listing.date}</td>
                    <td>{listing.location}</td>
                    <td>{listing.attendees}</td>
                    <td>
                      <span className={`${styles.statusBadge} ${getStatusClass(listing.status)}`}>
                        {listing.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className={styles.noData}>
                    Sonuç bulunamadı
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className={styles.stats}>
          <div className={styles.statCard}>
            <div className={styles.statValue}>
              {filteredListings.length}
            </div>
            <div className={styles.statLabel}>
              Toplam İlan
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statValue}>
              {filteredListings.filter(l => l.status === 'Aktif').length}
            </div>
            <div className={styles.statLabel}>
              Aktif İlan
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statValue}>
              {filteredListings.reduce((sum, l) => sum + l.attendees, 0)}
            </div>
            <div className={styles.statLabel}>
              Toplam Katılımcı
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Listings
