import { useState, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { PhoneInput } from 'react-international-phone'
import 'react-international-phone/style.css'
import styles from './Login.module.css'
import { icons } from '../../constants/icon'

interface LoginProps {
  onLogin: () => void
}

function Login({ onLogin }: LoginProps) {
  const navigate = useNavigate()
  const [phoneNumber, setPhoneNumber] = useState('')
  const [phoneError, setPhoneError] = useState('')

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setPhoneError('')

    // Check for empty field
    if (!phoneNumber || phoneNumber.length < 10) {
      setPhoneError('Lütfen geçerli bir telefon numarası girin')
      return
    }

    // Navigate to OTP screen with phone number
    navigate('/otp', { state: { phoneNumber } })
  }

  return (
    <div className={styles.container}>
      <div className={styles.loginBox}>
        <div className={styles.header}>
          <div
            className={styles.logo}
            dangerouslySetInnerHTML={{ __html: icons.party }}
          />
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="phone">Telefon Numarası</label>
            <PhoneInput
              defaultCountry="tr"
              value={phoneNumber}
              onChange={(phone) => {
                setPhoneNumber(phone)
                setPhoneError('')
              }}
              className={phoneError ? styles.phoneInputError : ''}
            />
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

          <button type="submit" className={styles.loginButton}>
            Devam Et
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login
