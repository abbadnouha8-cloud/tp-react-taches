import { useEffect, useState } from 'react'
import Carte from './components/Carte.jsx'
import Compteur from './components/Compteur.jsx'
import Entete from './components/Entete.jsx'
import Filtres from './components/Filtres.jsx'
import FormulaireAjout from './components/FormulaireAjout.jsx'
import Horloge from './components/Horloge.jsx'
import ListeTaches from './components/ListeTaches.jsx'
import Pied from './components/Pied.jsx'
import Statistiques from './components/Statistiques.jsx'

function lireSauvegarde() {
  try {
    const texte = localStorage.getItem('taches')
    return texte === null ? null : JSON.parse(texte)
  } catch {
    return null
  }
}

function App() {
  const [taches, setTaches] = useState(() => lireSauvegarde() ?? [])
  const [filtre, setFiltre] = useState('toutes')
  const [chargement, setChargement] = useState(() => lireSauvegarde() === null)
  const [erreur, setErreur] = useState(null)
  const [horlogeVisible, setHorlogeVisible] = useState(true)

  useEffect(() => {
    if (lireSauvegarde() !== null) return

    let annule = false

    fetch('/taches.json')
      .then((reponse) => {
        if (!reponse.ok) throw new Error(`Erreur HTTP ${reponse.status}`)
        return reponse.json()
      })
      .then((donnees) => {
        if (!annule) setTaches(donnees)
      })
      .catch((err) => {
        if (!annule) setErreur(err.message)
      })
      .finally(() => {
        if (!annule) setChargement(false)
      })

    return () => {
      annule = true
    }
  }, [])

  const restantes = taches.filter((tache) => !tache.terminee).length
  const nbTerminees = taches.length - restantes

  useEffect(() => {
    document.title = `(${restantes}) Mes tâches`
  }, [restantes])

  useEffect(() => {
    if (chargement || erreur) return
    localStorage.setItem('taches', JSON.stringify(taches))
  }, [taches, chargement, erreur])

  function basculerTache(id) {
    setTaches(
      taches.map((tache) =>
        tache.id === id ? { ...tache, terminee: !tache.terminee } : tache,
      ),
    )
  }

  function supprimerTache(id) {
    setTaches(taches.filter((tache) => tache.id !== id))
  }

  function ajouterTache(titre) {
    setTaches([...taches, { id: Date.now(), titre, terminee: false }])
  }

  function modifierTache(id, titre) {
    setTaches(
      taches.map((tache) => (tache.id === id ? { ...tache, titre } : tache)),
    )
  }

  function supprimerTerminees() {
    setTaches(taches.filter((tache) => !tache.terminee))
  }

  const tachesVisibles = taches.filter((tache) => {
    if (filtre === 'actives') return !tache.terminee
    if (filtre === 'terminees') return tache.terminee
    return true
  })

  return (
    <div className="app">
      <Entete titre="Mes tâches" sousTitre="Mon premier projet React" />
      <Carte titre="Heure actuelle">
        <button onClick={() => setHorlogeVisible(!horlogeVisible)}>
          {horlogeVisible ? "Masquer l'horloge" : "Afficher l'horloge"}
        </button>
        {horlogeVisible && <Horloge />}
      </Carte>
      <Carte titre="Compteur">
        <Compteur />
      </Carte>
      <Carte titre="Nouvelle tâche">
        <FormulaireAjout onAjouter={ajouterTache} />
      </Carte>
      <Carte titre="Ma liste">
        <Filtres filtre={filtre} onChanger={setFiltre} />
        <button
          className="danger"
          onClick={supprimerTerminees}
          disabled={nbTerminees === 0}
        >
          Supprimer les tâches terminées
        </button>
        {chargement && <p className="vide">Chargement des tâches…</p>}
        {erreur && <p className="erreur">{erreur}</p>}
        {!chargement && !erreur && (
          <ListeTaches
            taches={tachesVisibles}
            onBasculer={basculerTache}
            onSupprimer={supprimerTache}
            onModifier={modifierTache}
          />
        )}
      </Carte>
      <Carte titre="Statistiques">
        <Statistiques taches={taches} />
      </Carte>
      <Pied auteur="Nouha Abbad" />
    </div>
  )
}

export default App