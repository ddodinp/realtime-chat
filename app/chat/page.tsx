"use client";

import { useEffect, useRef, useState } from "react";
import Pusher from "pusher-js";
import { useSearchParams } from "next/navigation";
import { useChatStore } from "@/store/useChatStore";
import { v4 as uuid } from "uuid";

export default function ChatPage() {
  const params = useSearchParams();
  const room = params.get("room")!;
  const user = params.get("user")!;

  const { messages, add } = useChatStore();
  const [text, setText] = useState("");
  const [image, setImage] = useState<string | null>(null);

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (room !== "ipartners") {
      alert("잘못된 접근입니다");
      window.location.href = "/";
      return;
    }

    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
      forceTLS: true,
    });

    const channel = pusher.subscribe(room);

    channel.bind("message", (data: any) => {
      if (data.user === user) return;
      add(data);
    });

    return () => {
      channel.unsubscribe();
      pusher.disconnect();
    };
  }, [room, user, add]);

  // 자동 스크롤
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async () => {
    if (!text && !image) return;

    const msg = {
      id: uuid(),
      user,
      text,
      image,
      createdAt: Date.now(),
    };

    add(msg);

    await fetch("/api/message", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ room, message: msg }),
    });

    setText("");
    setImage(null);
  };

  const handleImage = (e: any) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = () => setImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex flex-col h-screen bg-slate-950 text-white">
      
      {/* 헤더 */}
      <div className="px-4 py-3 border-b border-slate-800 backdrop-blur bg-slate-900/70">
        <h1 className="font-semibold text-lg">💬 ipartners</h1>
      </div>

      {/* 채팅 영역 */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {messages.map((m) => {
          const isMe = m.user === user;

          return (
            <div
              key={m.id}
              className={`flex ${isMe ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`
                  max-w-[70%] px-4 py-2 rounded-2xl shadow-md
                  ${isMe 
                    ? "bg-blue-600 text-white rounded-br-sm" 
                    : "bg-slate-800 text-slate-100 rounded-bl-sm"}
                `}
              >
                {!isMe && (
                  <div className="text-xs opacity-60 mb-1">
                    {m.user}
                  </div>
                )}

                {m.text && <p className="text-sm">{m.text}</p>}

                {m.image && (
                  <img
                    src={m.image}
                    className="mt-2 rounded-lg max-w-[200px]"
                  />
                )}
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* 입력 영역 */}
      <div className="p-3 border-t border-slate-800 bg-slate-900/70 backdrop-blur">
        <div className="flex items-center gap-2">
          
          <input
            className="flex-1 px-4 py-2 rounded-xl bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="메시지 입력..."
            onKeyDown={(e) => {
              if (e.key === "Enter") send();
            }}
          />

          <input
            type="file"
            onChange={handleImage}
            className="text-xs text-slate-400"
          />

          <button
            onClick={send}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-xl text-sm font-medium transition"
          >
            전송
          </button>
        </div>
      </div>
    </div>
  );
}