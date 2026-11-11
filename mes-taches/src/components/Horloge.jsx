import { useEffect, useState } from 'react'

function Horloge() {
  const [maintenant, setMaintenant] = useState(() => new Date())

  useEffect(() => {
    const id = setInterval(() => setMaintenant(new Date()), 1000)
    return () => {
      console.log('Nettoyage : minuteur arrêté')
      clearInterval(id)
    }
  }, [])

  return <p className="horloge">{maintenant.toLocaleTimeString('fr-FR')}</p>
}

export default Horloge