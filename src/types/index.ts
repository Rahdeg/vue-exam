export interface User {
  _id: string;
  name?: string;
  email?: string;
  image?: string;
}

export interface Todo {
  _id: string;
  title: string;
  description?: string;
  status: "TODO" | "IN_PROGRESS" | "DONE" | "CANCELLED";
  priority: "LOW" | "MEDIUM" | "HIGH";
  tags?: string[];
  dueDate?: number;
  isPublic: boolean;
  userId: string;
  createdAt: number;
  updatedAt: number;
  user?: User;
  commentCount?: number;
  reactionCount?: number;
}

export interface Comment {
  _id: string;
  body: string;
  todoId: string;
  userId: string;
  parentCommentId?: string;
  createdAt: number;
  updatedAt: number;
  user?: User;
}

export interface Reaction {
  _id: string;
  emoji: string;
  todoId?: string;
  commentId?: string;
  messageId?: string;
  userId: string;
  createdAt: number;
}

export interface Conversation {
  _id: string;
  type: "dm" | "group";
  participants: string[];
  createdBy: string;
  createdAt: number;
  updatedAt: number;
  lastMessageAt?: number;
  otherUser?: User;
  latestMessage?: Message;
  unreadCount: number;
}

export interface Message {
  _id: string;
  body: string;
  type: "text" | "image" | "file";
  conversationId: string;
  senderId: string;
  replyToMessageId?: string;
  editedAt?: number;
  deletedAt?: number;
  isStarred?: boolean;
  createdAt: number;
  sender?: User;
  replyToMessage?: Message;
}

export interface Notification {
  _id: string;
  type:
    | "TASK_COMMENT"
    | "TASK_STATUS_CHANGE"
    | "TASK_ASSIGNED"
    | "TASK_DUE_SOON"
    | "COMMENT_REPLY"
    | "REACTION_ADDED"
    | "NEW_MESSAGE"
    | "TASK_MENTION";
  title: string;
  message: string;
  userId: string;
  actorId: string;
  relatedId?: string;
  isRead: boolean;
  createdAt: number;
}

export interface NotificationPreferences {
  userId: string;
  taskComments: boolean;
  taskStatusChanges: boolean;
  taskAssignments: boolean;
  taskDueReminders: boolean;
  commentReplies: boolean;
  reactions: boolean;
  directMessages: boolean;
  mentions: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;
  updatedAt: number;
}

export type FilterType = "all" | "my" | "public";
export type AuthMode = "signin" | "signup";
