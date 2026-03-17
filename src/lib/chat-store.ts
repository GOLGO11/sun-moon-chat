import { seededChatMessages } from "@/src/data/demo";
import type { ChatMessage } from "@/src/types/demo";

type ThreadState = {
  messages: ChatMessage[];
  reported: boolean;
};

const chatThreads = new Map<string, ThreadState>();

function createThreadKey(firstUserId: string, secondUserId: string) {
  return [firstUserId, secondUserId].sort().join("__");
}

function cloneMessages(messages: ChatMessage[]) {
  return messages.map((message) => ({ ...message }));
}

function bootstrapThread(firstUserId: string, secondUserId: string) {
  const key = createThreadKey(firstUserId, secondUserId);
  const seed = seededChatMessages[key] ?? [];

  if (!chatThreads.has(key)) {
    chatThreads.set(key, {
      messages: cloneMessages(seed),
      reported: false,
    });
  }

  return { key, thread: chatThreads.get(key)! };
}

export function getThread(firstUserId: string, secondUserId: string) {
  const { key, thread } = bootstrapThread(firstUserId, secondUserId);

  return {
    key,
    messages: cloneMessages(thread.messages),
    reported: thread.reported,
  };
}

export function sendThreadMessage(from: string, to: string, text: string) {
  const trimmed = text.trim();

  if (!trimmed) {
    throw new Error("MESSAGE_EMPTY");
  }

  const { thread } = bootstrapThread(from, to);
  const message: ChatMessage = {
    id: `m_${Date.now()}`,
    from,
    to,
    text: trimmed,
    sentAt: new Date().toISOString(),
  };

  thread.messages.push(message);

  return message;
}

export function reportThread(firstUserId: string, secondUserId: string) {
  const { thread } = bootstrapThread(firstUserId, secondUserId);
  thread.reported = true;

  return { ok: true };
}

export function resetChatStore() {
  chatThreads.clear();
}
