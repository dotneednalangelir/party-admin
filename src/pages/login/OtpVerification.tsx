import { useState, FormEvent, useEffect, useRef } from 'react'
import styles from './Login.module.css'
import otpStyles from './OtpVerification.module.css'
import { icons } from '../../constants/icon'

interface OtpVerificationProps {
  phoneNumber: string
  onVerify: (code: string) => void
  onResendOtp: () => void
  onBack: () => void
}

function OtpVerification({ phoneNumber, onVerify, onResendOtp, onBack }: OtpVerificationProps) {
  const [otp, setOtp] = useState(['', '', '', ''])
  const [otpError, setOtpError] = useState('')
  const [loading, setLoading] = useState(false)
  const [countdown, setCountdown] = useState(300)
  const [canResend, setCanResend] = useState(false)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    inputRefs.current[0]?.focus()
  }, [])

  useEffect(() => {
    let interval: number

    if (countdown > 0 && !canResend) {
      interval = window.setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            setCanResend(true)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }

    return () => {
      if (interval) {
        clearInterval(interval)
      }
    }
  }, [countdown, canResend])

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value.slice(-1)
    setOtp(newOtp)
    setOtpError('')

    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus()
    }

    if (newOtp.every((digit) => digit !== '')) {
      const code = newOtp.join('')
      handleVerify(code)
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text/plain').replace(/\D/g, '').slice(0, 4)
    const newOtp = [...otp]

    for (let i = 0; i < pastedData.length; i++) {
      newOtp[i] = pastedData[i]
    }

    setOtp(newOtp)

    if (pastedData.length === 4) {
      inputRefs.current[3]?.focus()
      handleVerify(pastedData)
    } else if (pastedData.length > 0) {
      inputRefs.current[Math.min(pastedData.length, 3)]?.focus()
    }
  }

  const handleVerify = async (code: string) => {
    if (code.length !== 4) {
      setOtpError('Lütfen 4 haneli kodu eksiksiz giriniz.')
      return
    }

    setLoading(true)
    setOtpError('')

    try {
      await onVerify(code)
    } catch (error: any) {
      setOtpError(error.message || 'Doğrulama kodu hatalı. Lütfen tekrar deneyin.')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const code = otp.join('')
    handleVerify(code)
  }

  const handleResend = async () => {
    if (!canResend) return

    try {
      await onResendOtp()
      setCountdown(300)
      setCanResend(false)
      setOtp(['', '', '', ''])
      setOtpError('')
      inputRefs.current[0]?.focus()
    } catch (error: any) {
      setOtpError(error.message || 'Kod gönderilirken bir hata oluştu.')
    }
  }

  const getLastFourDigits = () => {
    const numbers = phoneNumber.replace(/\D/g, '')
    return numbers.slice(-4)
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

        <div className={otpStyles.content}>
          <h2 className={otpStyles.title}>Doğrulama Kodu</h2>
          <p className={otpStyles.subtitle}>
            {getLastFourDigits()} ile biten telefon numaranıza gönderilen 4 haneli kodu giriniz.
          </p>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={otpStyles.otpContainer}>
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
                  onPaste={handlePaste}
                  className={`${otpStyles.otpInput} ${otpError ? otpStyles.otpInputError : ''}`}
                  disabled={loading}
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

            <div className={otpStyles.resendContainer}>
              <span className={otpStyles.resendLabel}>Kod iletilmedi mi?</span>
              <button
                type="button"
                onClick={handleResend}
                disabled={!canResend}
                className={otpStyles.resendButton}
              >
                Kodu tekrar gönder
              </button>
              {!canResend && (
                <span className={otpStyles.countdown}>{formatTime(countdown)} sn</span>
              )}
            </div>

            <div className={otpStyles.buttonGroup}>
              <button
                type="button"
                onClick={onBack}
                className={otpStyles.backButton}
                disabled={loading}
              >
                Geri
              </button>
              <button type="submit" className={styles.loginButton} disabled={loading}>
                {loading ? 'Doğrulanıyor...' : 'Doğrula'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default OtpVerification
