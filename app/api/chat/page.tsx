"use client"

import { useEffect, useState } from "react"
import Pusher from "pusher-js"
import { useSearchParams } from "next/navigation"
import { useChatStore } from "@/store/useChatStore"
import { v4 as uuid } from "uuid"

export default function ChatPage() {
    const params = useSearchParams()
    const room = params.get("room")!
    const user = params.get("user")!

    const { messages, add } = useChatStore()

    const [text, setText] = useState("")
    const [image, setImage] = useState<string | null>(null)

    useEffect(() => {
        const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
        cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
        })

        const channel = pusher.subscribe(room)

        channel.bind("message", (data: any) => {
        add(data)
        })

        return () => {
        channel.unsubscribe()
        }
    }, [])

    const send = async () => {
        const msg = {
        id: uuid(),
        user,
        text,
        image,
        createdAt: Date.now(),
        }

        await fetch("/api/message", {
        method: "POST",
        body: JSON.stringify({ room, message: msg }),
        })

        setText("")
        setImage(null)
    }

    const handleImage = (e: any) => {
        const file = e.target.files[0]
        const reader = new FileReader()
        reader.onload = () => setImage(reader.result as string)
        reader.readAsDataURL(file)
    }

    return (
        <div style={{ padding: 20 }}>
        <h2>Room: {room}</h2>

        <div>
            {messages.map((m) => (
            <div key={m.id}>
                <b>{m.user}</b>
                <p>{m.text}</p>
                {m.image && <img src={m.image} width={200} />}
            </div>
            ))}
        </div>

        <input value={text} onChange={(e) => setText(e.target.value)} />
        <input type="file" onChange={handleImage} />
        <button onClick={send}>전송</button>
        </div>
    )
}