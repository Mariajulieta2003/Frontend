import React, { createContext, useContext, useCallback, useMemo, useState } from "react";

const MessageContext = createContext(null);

export function MessageProvider({ children }) {
  const [messages, setMessages] = useState([]); // [{id, text, type}]

  const addMessage = useCallback((text, type = "info", ttlMs = 4000) => {
    const id = crypto?.randomUUID?.() || String(Date.now() + Math.random());
    const msg = { id, text, type };
    setMessages((prev) => [...prev, msg]);
    if (ttlMs > 0) {
      setTimeout(() => {
        setMessages((prev) => prev.filter((m) => m.id !== id));
      }, ttlMs);
    }
  }, []);

  const clearMessages = useCallback(() => setMessages([]), []);

  const value = useMemo(
    () => ({ messages, addMessage, clearMessages }),
    [messages, addMessage, clearMessages]
  );

  return <MessageContext.Provider value={value}>{children}</MessageContext.Provider>;
}

export function useMessage() {
  return useContext(MessageContext);
}
