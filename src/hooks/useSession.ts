// This is hook that will manage login and logout

import { useState, useEffect } from "react"

export default function useSession() {
  const [session, setSession] = useState<string | null>(null)

  useEffect(() => {
    const session = localStorage.getItem("session")
    if (session) {
      setSession(session)
    }
  }, [])

  const login = (access_token: string) => {
    localStorage.setItem("session", access_token)
    setSession(session)
  }

  const logout = () => {
    localStorage.removeItem("session")
    setSession(null)
  }

  const isLoggedIn = () => {
    return session !== null
  }

  return { session, isLoggedIn, login, logout }
}
