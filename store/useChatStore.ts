import { create } from "zustand"
import { Message } from "@/types/chat"

type State = {
    messages: Message[]
    add: (msg: Message) => void
    }

    export const useChatStore = create<State>((set) => ({
    messages: [],
    add: (msg) =>
        set((s) => ({
        messages: [...s.messages, msg],
        })),
}))