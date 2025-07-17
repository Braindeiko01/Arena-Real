import { initializeApp, cert, getApps } from 'firebase-admin/app'
import { getFirestore, Timestamp } from 'firebase-admin/firestore'
import fs from 'fs'

async function main() {
  const credentialPath = process.env.FIREBASE_SERVICE_ACCOUNT_FILE || process.env.GOOGLE_APPLICATION_CREDENTIALS
  if (!credentialPath) {
    throw new Error('Set FIREBASE_SERVICE_ACCOUNT_FILE or GOOGLE_APPLICATION_CREDENTIALS')
  }
  const serviceAccount = JSON.parse(fs.readFileSync(credentialPath, 'utf8'))
  const app = getApps().length ? getApps()[0] : initializeApp({ credential: cert(serviceAccount) })
  const db = getFirestore(app)

  const parentChats = await db.collection('chats').listDocuments()
  for (const parent of parentChats) {
    const subRef = parent.collection('chats')
    const subSnap = await subRef.get()
    if (subSnap.empty) continue

    for (const doc of subSnap.docs) {
      const data = doc.data()
      if (!data.createdAt) {
        data.createdAt = Timestamp.now()
      }
      const newDocRef = db.collection('chats').doc(doc.id)
      await newDocRef.set(data, { merge: true })

      const msgsSnap = await doc.ref.collection('messages').get()
      for (const msg of msgsSnap.docs) {
        await newDocRef.collection('messages').doc(msg.id).set(msg.data())
      }
      console.log(`Migrated ${doc.ref.path} -> ${newDocRef.path}`)
    }
  }

  console.log('Migration finished')
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
