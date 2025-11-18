import { useState } from 'react'
import { authService } from '../../services/AuthService'
import PhoneLogin from './PhoneLogin'
import OtpVerification from './OtpVerification'

interface LoginProps {
  onLogin: () => void
}

type LoginStep = 'phone' | 'otp'

function Login({ onLogin }: LoginProps) {
  const [step, setStep] = useState<LoginStep>('phone')
  const [phoneNumber, setPhoneNumber] = useState('')

  const handleSendOtp = async (phone: string) => {
    const response = await authService.loginByPhone(phone)

    if (response.data.isMessageSent) {
      setPhoneNumber(phone)
      setStep('otp')
    } else {
      throw new Error('Kod gönderilemedi. Lütfen tekrar deneyin.')
    }
  }

  const handleVerifyOtp = async (code: string) => {
    const response = await authService.validateLoginCode(phoneNumber, code)

    if (response.data.accessToken) {
      onLogin()
    } else {
      throw new Error('Doğrulama kodu hatalı.')
    }
  }

  const handleResendOtp = async () => {
    await authService.loginByPhone(phoneNumber)
  }

  const handleBack = () => {
    setStep('phone')
    setPhoneNumber('')
  }

  if (step === 'otp') {
    return (
      <OtpVerification
        phoneNumber={phoneNumber}
        onVerify={handleVerifyOtp}
        onResendOtp={handleResendOtp}
        onBack={handleBack}
      />
    )
  }

  return <PhoneLogin onSendOtp={handleSendOtp} />
}

export default Login
