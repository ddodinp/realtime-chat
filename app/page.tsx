"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function Home() {
    const [user, setUser] = useState("")
    const [room, setRoom] = useState("")
    const router = useRouter()

    return (
      <div style={{ padding: 40 }}>
        <h1>채팅 입장</h1>

        <input placeholder="이름" onChange={(e) => setUser(e.target.value)} />
        <br />
        <input placeholder="입장 코드" onChange={(e) => setRoom(e.target.value)} />
        <br />

        <button
          onClick={() => {
            if (!user || !room) return alert("입력해")
            router.push(`/chat?room=${room}&user=${user}`)
          }}
        >
          입장
        </button>
      </div>
    )
}