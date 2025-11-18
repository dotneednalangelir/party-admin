import { useState, FormEvent } from 'react'
import styles from './Login.module.css'
import { icons } from '../../constants/icon'

interface PhoneLoginProps {
  onSendOtp: (phoneNumber: string) => void
}

function PhoneLogin({ onSendOtp }: PhoneLoginProps) {
  const [phoneNumber, setPhoneNumber] = useState('')
  const [phoneError, setPhoneError] = useState('')
  const [loading, setLoading] = useState(false)

  const formatPhoneNumber = (value: string): string => {
    const numbers = value.replace(/\D/g, '')
    if (numbers.length === 0) return ''
    if (numbers.length <= 3) return numbers
    if (numbers.length <= 6) return `${numbers.slice(0, 3)} ${numbers.slice(3)}`
    if (numbers.length <= 8) return `${numbers.slice(0, 3)} ${numbers.slice(3, 6)} ${numbers.slice(6)}`
    return `${numbers.slice(0, 3)} ${numbers.slice(3, 6)} ${numbers.slice(6, 8)} ${numbers.slice(8, 10)}`
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value)
    setPhoneNumber(formatted)
    setPhoneError('')
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setPhoneError('')

    const numbers = phoneNumber.replace(/\D/g, '')

    if (!numbers) {
      setPhoneError('Lütfen telefon numaranızı girin')
      return
    }

    if (numbers.length !== 10) {
      setPhoneError('Telefon numarası 10 haneli olmalıdır')
      return
    }

    setLoading(true)
    try {
      const fullPhoneNumber = `+90${numbers}`
      await onSendOtp(fullPhoneNumber)
    } catch (error: any) {
      setPhoneError(error.message || 'Bir hata oluştu. Lütfen tekrar deneyin.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.loginBox}>
        <div className={styles.header}>
          <div
            className={styles.logo}
            dangerouslySetInnerHTML={{ __html: icons.party }}
          />
          <p>Admin Paneli</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="phone">Telefon Numarası</label>
            <div style={{ position: 'relative' }}>
              <span
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--black)',
                  fontSize: 'var(--font-size-xs)',
                  pointerEvents: 'none',
                }}
              >
                +90
              </span>
              <input
                type="text"
                id="phone"
                value={phoneNumber}
                onChange={handlePhoneChange}
                placeholder="5XX XXX XX XX"
                className={phoneError ? styles.inputError : ''}
                style={{ paddingLeft: '48px' }}
                maxLength={13}
                disabled={loading}
              />
            </div>
            {phoneError && (
              <div className={styles.error}>
                <div
                  className={styles.errorIcon}
                  dangerouslySetInnerHTML={{ __html: icons.infoCircle }}
                />
                <span>{phoneError}</span>
              </div>
            )}
          </div>

          <button type="submit" className={styles.loginButton} disabled={loading}>
            {loading ? 'Gönderiliyor...' : 'Kod Gönder'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default PhoneLogin
