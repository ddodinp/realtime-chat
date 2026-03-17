"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [user, setUser] = useState("");
  const [room, setRoom] = useState("");
  const router = useRouter();

  const enter = () => {
    if (!user || !room) {
      alert("이름과 입장코드를 입력하세요");
      return;
    }

    // 🔥 여기 추가
    if (room !== "ipartners") {
      alert("유효하지 않은 입장코드입니다");
      return;
    }

    router.push(`/chat?room=${room}&user=${user}`);
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>채팅 입장</h1>

      <input
        placeholder="이름"
        onChange={(e) => setUser(e.target.value)}
      />
      <br />

      <input
        placeholder="입장 코드"
        onChange={(e) => setRoom(e.target.value)}
      />
      <br />

      <button onClick={enter}>입장</button>
    </div>
  );
}