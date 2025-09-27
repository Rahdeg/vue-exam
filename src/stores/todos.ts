import { defineStore } from "pinia";
import { computed, readonly } from "vue";
import { useQuery, useMutation } from "../composables/useConvex";
import { api } from "../../convex/_generated/api";
import type { Todo, FilterType } from "@/types";

export const useTodosStore = defineStore("todos", () => {
  const myTodos = useQuery(api.todos.getMyTodos, {});
  const publicTodos = useQuery(api.todos.getPublicTodos, {});
  const createTodo = useMutation(api.todos.create);
  const updateTodo = useMutation(api.todos.update);
  const deleteTodo = useMutation(api.todos.remove);

  const getFilteredTodos = (filter: FilterType): Todo[] => {
    if (filter === "my") return (myTodos.data.value as Todo[]) || [];
    if (filter === "public") return (publicTodos.data.value as Todo[]) || [];

    // Combine and deduplicate tasks for "all" view
    const myTodosList = (myTodos.data.value as Todo[]) || [];
    const publicTodosList = (publicTodos.data.value as Todo[]) || [];

    // Create a Set of task IDs to track duplicates
    const seenIds = new Set<string>();
    const allTodos: Todo[] = [];

    // Add all user's tasks first
    for (const todo of myTodosList) {
      if (!seenIds.has(todo._id) && todo.user?._id) {
        seenIds.add(todo._id);
        allTodos.push(todo as Todo);
      }
    }

    // Add public tasks that aren't already included
    for (const todo of publicTodosList) {
      if (!seenIds.has(todo._id) && todo.user?._id) {
        seenIds.add(todo._id);
        allTodos.push(todo as Todo);
      }
    }

    return allTodos;
  };

  const createNewTodo = async (
    todoData: Omit<Todo, "_id" | "userId" | "createdAt" | "updatedAt">
  ) => {
    try {
      await createTodo.mutate(todoData);
    } catch (error) {
      console.error("Failed to create todo:", error);
      throw error;
    }
  };

  const updateExistingTodo = async (id: string, updates: Partial<Todo>) => {
    try {
      await updateTodo.mutate({ id, ...updates });
    } catch (error) {
      console.error("Failed to update todo:", error);
      throw error;
    }
  };

  const removeTodo = async (id: string) => {
    try {
      await deleteTodo.mutate({ id });
    } catch (error) {
      console.error("Failed to delete todo:", error);
      throw error;
    }
  };

  return {
    myTodos: readonly(myTodos),
    publicTodos: readonly(publicTodos),
    getFilteredTodos,
    createNewTodo,
    updateExistingTodo,
    removeTodo,
  };
});
