import { NextRequest, NextResponse } from 'next/server'
import { getApps, initializeApp, cert, App } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import { getFirestore } from 'firebase-admin/firestore'
import fs from 'fs'

let firebaseApp: App | undefined

function initFirebase() {
  if (!getApps().length) {
    const path = process.env.FIREBASE_SERVICE_ACCOUNT_FILE || process.env.GOOGLE_APPLICATION_CREDENTIALS
    if (!path) {
      throw new Error('Firebase service account path not set')
    }
    const serviceAccount = JSON.parse(fs.readFileSync(path, 'utf8'))
    firebaseApp = initializeApp({ credential: cert(serviceAccount) })
  } else {
    firebaseApp = getApps()[0]
  }
}

initFirebase()
const auth = getAuth(firebaseApp!)
const db = getFirestore(firebaseApp!)

export async function middleware(req: NextRequest) {
  const authHeader = req.headers.get('authorization') || ''
  const token = authHeader.startsWith('Bearer ') ? authHeader.replace('Bearer ', '') : null
  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  let decoded: { uid: string } | null = null
  try {
    decoded = await auth.verifyIdToken(token)
  } catch (err) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  const { pathname } = req.nextUrl

  if (pathname.startsWith('/chat/')) {
    const chatId = pathname.split('/')[2]
    try {
      const snap = await db.collection('chats').doc(chatId).get()
      if (!snap.exists) {
        return NextResponse.redirect(new URL('/not-found', req.url))
      }
      const data = snap.data() as
        | { jugadores?: string[]; participants?: string[] }
        | undefined
      const participants = data?.jugadores || data?.participants
      if (!participants?.includes(decoded.uid)) {
        return NextResponse.redirect(new URL('/not-found', req.url))
      }
    } catch (err) {
      return NextResponse.redirect(new URL('/not-found', req.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/chat/:id*', '/profile', '/game/:id*']
}
