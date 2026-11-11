import { useState } from 'react'

function Tache({ id, titre, terminee, onBasculer, onSupprimer, onModifier }) {
  const [enEdition, setEnEdition] = useState(false)
  const [brouillon, setBrouillon] = useState(titre)

  function commencer() {
    setBrouillon(titre)
    setEnEdition(true)
  }

  function valider() {
    const titreNettoye = brouillon.trim()
    if (titreNettoye !== '') onModifier(id, titreNettoye)
    setEnEdition(false)
  }

  function gererTouche(event) {
    if (event.key === 'Enter') valider()
    if (event.key === 'Escape') setEnEdition(false)
  }

  return (
    <li className={terminee ? 'tache terminee' : 'tache'}>
      <input
        type="checkbox"
        checked={terminee}
        onChange={() => onBasculer(id)}
      />
      {enEdition ? (
        <input
          type="text"
          value={brouillon}
          onChange={(event) => setBrouillon(event.target.value)}
          onKeyDown={gererTouche}
          autoFocus
        />
      ) : (
        <span className="titre" onDoubleClick={commencer}>
          {titre}
        </span>
      )}
      <button className="danger" onClick={() => onSupprimer(id)}>
        Supprimer
      </button>
    </li>
  )
}

export default Tache