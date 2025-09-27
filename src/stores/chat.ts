import { defineStore } from "pinia";
import { readonly } from "vue";
import { useQuery, useMutation } from "../composables/useConvex";
import { api } from "../../convex/_generated/api";
import type { Conversation, Message } from "@/types";

export const useChatStore = defineStore("chat", () => {
  const conversations = useQuery(api.chats.getConversations);
  const createOrGetConversation = useMutation(
    api.chats.createOrGetConversation
  );
  const sendMessage = useMutation(api.chats.sendMessage);
  const markAsRead = useMutation(api.chats.markAsRead);

  const getMessages = (conversationId: string) => {
    return useQuery(api.chats.getMessages, { conversationId });
  };

  const createConversation = async (otherUserId: string) => {
    try {
      return await createOrGetConversation.mutate({ otherUserId });
    } catch (error) {
      console.error("Failed to create conversation:", error);
      throw error;
    }
  };

  const sendNewMessage = async (
    conversationId: string,
    body: string,
    type: "text" | "image" | "file" = "text",
    replyToMessageId?: string
  ) => {
    try {
      return await sendMessage.mutate({
        conversationId,
        body,
        type,
        replyToMessageId,
      });
    } catch (error) {
      console.error("Failed to send message:", error);
      throw error;
    }
  };

  const markMessagesAsRead = async (messageIds: string[]) => {
    try {
      await markAsRead.mutate({ messageIds });
    } catch (error) {
      console.error("Failed to mark messages as read:", error);
      throw error;
    }
  };

  return {
    conversations: readonly(conversations),
    getMessages,
    createConversation,
    sendNewMessage,
    markMessagesAsRead,
  };
});
