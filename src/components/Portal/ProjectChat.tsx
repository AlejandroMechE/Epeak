"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { createClient } from "@/utils/supabase/client";
import { Send, Loader2 } from "lucide-react";
import styles from "./ProjectChat.module.css";

interface Message {
  id: string;
  content: string;
  sender_id: string;
  created_at: string;
  is_read: boolean;
}

interface ProjectChatProps {
  projectId?: string | null;
  userId: string; // The client's ID
  lang?: string;
  projectTitle?: string;
  isSupport?: boolean;
  isAdmin?: boolean;
  adminId?: string;
}

export default function ProjectChat({ 
  projectId, 
  userId, 
  lang = 'en', 
  projectTitle, 
  isSupport,
  isAdmin = false,
  adminId
}: ProjectChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  // Scroll to bottom whenever messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Initialize: find or create conversation for this project
  const initConversation = useCallback(async () => {
    setLoading(true);

    try {
      // Build query to find existing conversation
      let query = supabase
        .from("conversations")
        .select("id")
        .eq("client_id", userId);

      if (projectId) {
        query = query.eq("project_id", projectId);
      } else {
        query = query.filter("project_id", "is", null);
      }

      let { data: conv } = await query.single();

      if (!conv && !isAdmin) {
        // Create one (Admins usually don't originate general support convs, 
        // but if a project is selected they can)
        const { data: newConv, error } = await supabase
          .from("conversations")
          .insert({ 
            project_id: projectId || null, 
            client_id: userId 
          })
          .select("id")
          .single();
        
        if (error) throw error;
        conv = newConv;
      }

      if (!conv) { 
        setLoading(false); 
        return; 
      }

      setConversationId(conv.id);

      // Load existing messages
      const { data: msgs } = await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", conv.id)
        .order("created_at", { ascending: true });

      setMessages((msgs as Message[]) || []);
    } catch (err: any) {
      console.error("Chat init error details:", {
        message: err.message,
        code: err.code,
        hint: err.hint
      });
    } finally {
      setLoading(false);
    }
  }, [projectId, userId, isAdmin]);

  useEffect(() => {
    initConversation();
  }, [projectId, userId]);

  // Realtime subscription
  useEffect(() => {
    if (!conversationId) return;

    const channel = supabase
      .channel(`project-chat-${conversationId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          setMessages((prev) => {
            if (prev.some(m => m.id === payload.new.id)) return prev;
            return [...prev, payload.new as Message];
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId]);

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || !conversationId || sending) return;

    setSending(true);
    setInput("");

    // Identify who is sending
    const senderId = isAdmin ? adminId : userId;

    await supabase.from("messages").insert({
      conversation_id: conversationId,
      sender_id: senderId,
      content: trimmed,
    });

    await supabase
      .from("conversations")
      .update({ last_message_at: new Date().toISOString() })
      .eq("id", conversationId);

    setSending(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (iso: string) =>
    new Date(iso).toLocaleTimeString(lang === "es" ? "es-MX" : "en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div className={styles.chatContainer}>
      <div className={styles.chatHeader}>
        <div className={styles.chatMeta}>
          <span className={styles.chatLabel}>
            {isAdmin ? "ADMIN CONTROL" : (isSupport 
              ? (lang === "es" ? "TERMINAL DE SOPORTE" : "SUPPORT TERMINAL")
              : (lang === "es" ? "CANAL DEL PROYECTO" : "PROJECT CHANNEL"))
            }
          </span>
          <span className={styles.chatProject}>
            {isSupport 
              ? (lang === "es" ? "Consultas Generales" : "General Inquiries")
              : projectTitle
            }
          </span>
        </div>
        <div className={styles.onlineIndicator}>
          <span className={styles.onlineDot} />
          <span className={styles.onlineLabel}>
            {lang === "es" ? "En línea" : "Online"}
          </span>
        </div>
      </div>

      <div className={styles.messageArea}>
        {loading ? (
          <div className={styles.loadingState}>
            <Loader2 size={18} className={styles.spinner} />
          </div>
        ) : messages.length === 0 ? (
          <div className={styles.emptyMessages}>
            <p>
              {lang === "es"
                ? "No hay mensajes aún."
                : "No messages yet."}
            </p>
          </div>
        ) : (
          messages.map((msg) => {
            // If I am admin, "Own" means it was sent by me (adminId)
            // If I am client, "Own" means it was sent by me (userId)
            const isOwn = isAdmin ? msg.sender_id === adminId : msg.sender_id === userId;
            
            return (
              <div
                key={msg.id}
                className={`${styles.messageBubble} ${isOwn ? styles.ownMessage : styles.theirMessage}`}
              >
                <div className={styles.bubbleContent}>
                  <p className={styles.messageText}>{msg.content}</p>
                  <span className={styles.messageTime}>{formatTime(msg.created_at)}</span>
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      <div className={styles.inputArea}>
        <textarea
          className={styles.input}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={
            lang === "es"
              ? "Escribe un mensaje..."
              : "Type a message..."
          }
          rows={2}
          disabled={sending || loading}
        />
        <button
          className={styles.sendBtn}
          onClick={sendMessage}
          disabled={!input.trim() || sending || loading}
        >
          {sending ? <Loader2 size={16} className={styles.spinner} /> : <Send size={16} />}
        </button>
      </div>
    </div>
  );
}
