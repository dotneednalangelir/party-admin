import { useState, FormEvent, useRef, KeyboardEvent } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import styles from './Otp.module.css'
import { icons } from '../../constants/icon'

interface OtpProps {
  onLogin: () => void
}

function Otp({ onLogin }: OtpProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const phoneNumber = location.state?.phoneNumber

  const [otp, setOtp] = useState(['', '', '', ''])
  const [otpError, setOtpError] = useState('')
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  // Redirect to login if no phone number
  if (!phoneNumber) {
    navigate('/login', { replace: true })
    return null
  }

  const handleChange = (index: number, value: string) => {
    // Only allow numbers
    if (value && !/^\d$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)
    setOtpError('')

    // Move to next input if value is entered
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    // Move to previous input on backspace if current input is empty
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').trim()

    // Only process if it's 4 digits
    if (/^\d{4}$/.test(pastedData)) {
      const newOtp = pastedData.split('')
      setOtp(newOtp)
      setOtpError('')
      inputRefs.current[3]?.focus()
    }
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setOtpError('')

    const otpValue = otp.join('')

    if (otpValue.length < 4) {
      setOtpError('Lütfen 4 haneli kodu girin')
      return
    }

    // TODO: Replace with real OTP verification
    // For now, accept any 4-digit code
    onLogin()
    navigate('/panel')
  }

  const handleResendCode = () => {
    setOtp(['', '', '', ''])
    setOtpError('')
    inputRefs.current[0]?.focus()
    // TODO: Add API call to resend OTP
    console.log('Resending OTP to:', phoneNumber)
  }

  const formatPhoneNumber = (phone: string) => {
    // Format phone number for display
    const cleaned = phone.replace(/^\+90|^0/, '')
    return `+90 ${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6, 8)} ${cleaned.slice(8)}`
  }

  return (
    <div className={styles.container}>
      <div className={styles.otpBox}>
        <button
          type="button"
          onClick={() => navigate('/login')}
          className={styles.backButton}
          aria-label="Geri dön"
        >
          <div dangerouslySetInnerHTML={{ __html: icons.arrowLeft }} />
        </button>

        <div className={styles.header}>
          <div
            className={styles.logo}
            dangerouslySetInnerHTML={{ __html: icons.party }}
          />
          <h2 className={styles.title}>Doğrulama Kodu</h2>
          <p className={styles.description}>
            {formatPhoneNumber(phoneNumber)} numarasına gönderilen 4 haneli kodu girin
          </p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.otpInputs}>
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={index === 0 ? handlePaste : undefined}
                className={`${styles.otpInput} ${otpError ? styles.inputError : ''}`}
                autoFocus={index === 0}
              />
            ))}
          </div>

          {otpError && (
            <div className={styles.error}>
              <div
                className={styles.errorIcon}
                dangerouslySetInnerHTML={{ __html: icons.infoCircle }}
              />
              <span>{otpError}</span>
            </div>
          )}

          <button type="submit" className={styles.verifyButton}>
            Doğrula
          </button>

          <div className={styles.resendSection}>
            <p>Kod gelmedi mi?</p>
            <button
              type="button"
              onClick={handleResendCode}
              className={styles.resendButton}
            >
              Tekrar Gönder
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Otp
