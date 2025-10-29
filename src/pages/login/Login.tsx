import { useState, FormEvent } from 'react'
import styles from './Login.module.css'
import { icons } from '../../constants/icon'

interface LoginProps {
  onLogin: () => void
}

function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [loginError, setLoginError] = useState('')

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setEmailError('')
    setPasswordError('')
    setLoginError('')

    let hasError = false

    // Check for empty fields and validate format
    if (!email) {
      setEmailError('Lütfen e-posta adresinizi girin')
      hasError = true
    } else {
      // Email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        setEmailError('Geçerli bir e-posta adresi girin')
        hasError = true
      }
    }

    if (!password) {
      setPasswordError('Lütfen şifrenizi girin')
      hasError = true
    }

    if (hasError) return

    // Simple validation - replace with real authentication
    if (email === 'admin@party.com' && password === 'admin') {
      onLogin()
    } else {
      setLoginError('E-posta veya şifre hatalı')
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
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="email">E-posta</label>
            <input
              type="text"
              id="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                setEmailError('')
                setLoginError('')
              }}
              placeholder="E-posta adresinizi girin"
              className={emailError ? styles.inputError : ''}
            />
            {emailError && (
              <div className={styles.error}>
                <div
                  className={styles.errorIcon}
                  dangerouslySetInnerHTML={{ __html: icons.infoCircle }}
                />
                <span>{emailError}</span>
              </div>
            )}
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password">Şifre</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                setPasswordError('')
                setLoginError('')
              }}
              placeholder="Şifrenizi girin"
              className={passwordError ? styles.inputError : ''}
            />
            {passwordError && (
              <div className={styles.error}>
                <div
                  className={styles.errorIcon}
                  dangerouslySetInnerHTML={{ __html: icons.infoCircle }}
                />
                <span>{passwordError}</span>
              </div>
            )}
          </div>

          {loginError && (
            <div className={styles.error}>
              <div
                className={styles.errorIcon}
                dangerouslySetInnerHTML={{ __html: icons.infoCircle }}
              />
              <span>{loginError}</span>
            </div>
          )}

          <button type="submit" className={styles.loginButton}>
            Giriş Yap
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login
