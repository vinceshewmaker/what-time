import { initializeApp } from 'firebase/app'
import { getDatabase, ref, onValue, set } from 'firebase/database'

const firebaseConfig = {
  apiKey:            "AIzaSyA9Gm41Ob7vV8RwyurImXxskO5Vm6LvSfk",
  authDomain:        "what-time-a5105.firebaseapp.com",
  databaseURL:       "https://what-time-a5105-default-rtdb.firebaseio.com",
  projectId:         "what-time-a5105",
  storageBucket:     "what-time-a5105.firebasestorage.app",
  messagingSenderId: "685879374942",
  appId:             "1:685879374942:web:7957d0261e332a4cafb0cf"
}

const app = initializeApp(firebaseConfig)
export const db = getDatabase(app)

export function writeFamilyState(familyCode, state) {
  const key = familyCode.toLowerCase().replace(/\s+/g, '-')
  return set(ref(db, `families/${key}/state`), state)
}

export function subscribeFamilyState(familyCode, callback) {
  const key = familyCode.toLowerCase().replace(/\s+/g, '-')
  const stateRef = ref(db, `families/${key}/state`)
  return onValue(stateRef, (snapshot) => {
    callback(snapshot.val())
  })
}
