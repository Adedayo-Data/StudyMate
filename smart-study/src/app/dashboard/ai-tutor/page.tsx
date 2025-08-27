"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { tutorApi, type ChatMessage, type TutorSession } from "@/lib/api";

type UiMessage = {
  id: string | number;
  type: "user" | "ai";
  content: string;
  timestamp: Date;
};

const SESSION_KEY = "studymate.ai.sessionId";

const AITutorPage = () => {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [sending, setSending] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<UiMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");

  const quickQuestions = useMemo(
    () => [
      "Explain machine learning basics",
      "What is neural network?",
      "Help with Python syntax",
      "Data structures overview",
    ],
    []
  );

  // Helpers
  const toUi = (m: ChatMessage): UiMessage => ({
    id: m.id,
    type: m.role === "assistant" ? "ai" : "user",
    content: m.content,
    timestamp: new Date(m.timestamp),
  });

  const bootstrapSession = async () => {
    try {
      setLoading(true);
      setError(null);

      // Try existing sessionId from localStorage
      const saved = typeof window !== "undefined" ? localStorage.getItem(SESSION_KEY) : null;
      if (saved) {
        setSessionId(saved);
      }

      // Load sessions from backend
      const res = await tutorApi.getTutorSessions();
      if (!res.success) throw new Error(res.error || "Failed to load sessions");

      const sessions = res.data || [];
      let session: TutorSession | undefined = sessions.find((s) => s.id === saved) || sessions[0];

      // Create a session if none exist
      if (!session) {
        const created = await tutorApi.createTutorSession("General Tutoring");
        if (!created.success || !created.data) throw new Error(created.error || "Failed to create session");
        session = created.data;
      }

      setSessionId(session.id);
      if (typeof window !== "undefined") localStorage.setItem(SESSION_KEY, session.id);

      // Initialize messages
      const initialMessages: UiMessage[] = (session.messages || []).map(toUi);
      if (initialMessages.length === 0) {
        // Provide a friendly greeting if empty
        initialMessages.push({
          id: "greet",
          type: "ai",
          content:
            "Hello! I'm your AI tutor. Ask any question or pick a quick prompt on the right.",
          timestamp: new Date(),
        });
      }
      setMessages(initialMessages);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unexpected error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    bootstrapSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !sessionId || sending) return;
    setError(null);
    const userText = inputMessage.trim();
    setInputMessage("");

    // Optimistic user message
    const userMsg: UiMessage = {
      id: `local-${Date.now()}`,
      type: "user",
      content: userText,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);

    try {
      setSending(true);
      const res = await tutorApi.sendMessage(sessionId, userText);
      if (!res.success || !res.data) throw new Error(res.error || "Failed to send message");

      const reply = res.data; // Expect assistant reply from backend
      if (reply.content) {
        const ui = toUi(reply);
        // If backend echoes user role, ignore; only render assistant
        if (ui.type === "ai") {
          setMessages((prev) => [...prev, ui]);
        }
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Network error");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="border-b p-6">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary">
              <svg
                className="h-6 w-6 text-primary-foreground"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a 2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-semibold">AI Tutor</h1>
              <p className="text-sm text-muted-foreground">Your personal learning assistant</p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {loading && (
            <p className="text-sm text-muted-foreground">Connecting to tutor…</p>
          )}
          {!loading && messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[70%] rounded-lg p-4 ${
                  message.type === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                <p className="text-xs opacity-70 mt-2">
                  {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
            </div>
          ))}
          {error && (
            <div className="text-xs text-red-500">{error}</div>
          )}
        </div>

        {/* Input Area */}
        <div className="border-t p-6">
          <div className="flex space-x-2">
            <Input
              placeholder="Ask me anything about your studies..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              className="flex-1"
              disabled={loading || !sessionId}
            />
            <Button onClick={handleSendMessage} disabled={!inputMessage.trim() || loading || !sessionId || sending}>
              {sending ? (
                <span className="text-xs opacity-80">Sending…</span>
              ) : (
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="w-80 border-l bg-muted/30">
        {/* Quick Questions */}
        <div className="p-6">
          <h2 className="font-semibold mb-4">Quick Questions</h2>
          <div className="space-y-2">
            {quickQuestions.map((question, index) => (
              <Button
                key={index}
                variant="outline"
                className="w-full justify-start text-left h-auto p-3"
                onClick={() => setInputMessage(question)}
                disabled={loading || !sessionId}
              >
                <svg className="mr-2 h-4 w-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm">{question}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Study Topics */}
        <div className="p-6 border-t">
          <h2 className="font-semibold mb-4">Study Topics</h2>
          <div className="space-y-3">
            {[
              { name: "Mathematics", icon: "📊" },
              { name: "Programming", icon: "💻" },
              { name: "Science", icon: "🔬" },
              { name: "Languages", icon: "🌍" },
            ].map((topic, index) => (
              <div key={index} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted cursor-pointer">
                <span className="text-lg">{topic.icon}</span>
                <span className="text-sm font-medium">{topic.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AITutorPage;
