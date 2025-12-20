import type { Message } from "@/pages/Chat";
import { atom } from "jotai";

export const chatMessagesAtom = atom<Message[]>([]);

export const sendMessageAtom = atom<string | null>(null);

export const recieveMessageAtom = atom<string | null>(null);

export const clerkIdAtom = atom<string | null>(null);

export const otherUserIdAtom = atom<string | null>(null);

export const chatIdAtom = atom<string | null>(null);

export const isTypingAtom = atom<boolean>(false);

export const showTypingIndicatorAtom = atom<boolean>(false);