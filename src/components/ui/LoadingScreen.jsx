import { useEffect, useState } from 'react'
import styles from './LoadingScreen.module.css'

export default function LoadingScreen({ onDone }) {
  const [phase, setPhase] = useState('enter') // enter → pulse → exit

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('pulse'), 400)
    const t2 = setTimeout(() => setPhase('exit'), 3400)
    const t3 = setTimeout(() => onDone?.(), 4000)
    return () => [t1, t2, t3].forEach(clearTimeout)
  }, [])

  return (
    <div className={`${styles.splash} ${phase === 'exit' ? styles.exit : ''}`}>
      <div className={`${styles.iconWrap} ${styles[phase]}`}>
        <img src="/icon.png" alt="App Icon" className={styles.icon} />
        <div className={styles.ring1} />
        <div className={styles.ring2} />
        <div className={styles.ring3} />
      </div>

      <div className={`${styles.textWrap} ${phase === 'pulse' || phase === 'exit' ? styles.textVisible : ''}`}>
        <div className={styles.appName}>MedWaste Survey</div>
        <div className={styles.appSub}>Honiara Referral Hospital · Solomon Islands</div>
      </div>

      <div className={`${styles.loader} ${phase === 'pulse' || phase === 'exit' ? styles.loaderVisible : ''}`}>
        <div className={styles.loaderBar} />
      </div>

      <div className={styles.credit}>Research by Lorina Anisa · SINU ENV607</div>
    </div>
  )
}
