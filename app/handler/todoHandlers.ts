import { TodoManager } from "~/models/to-do-manager";

export function createTodoHandlers(todoManager: TodoManager) {
  return {
    todo_create: async (fd: FormData) => {
      const text = fd.get("text");
      const dateStr = fd.get("time"); // 这里现在只有 "YYYY-MM-DD"

      if (typeof text !== "string" || !text) {
        return Response.json({ error: "Invalid text" }, { status: 400 });
      }

      let dueTime = 0;
      if (typeof dateStr === "string" && dateStr.trim() !== "") {
        // 自动补上 23:59
        const date = new Date(dateStr + "T23:59:00");
        dueTime = date.getTime();
      }

      await todoManager.create(text, dueTime);
      return { success: true };
    },

    todo_delete: async (fd: FormData) => {
      const id = fd.get("id") as string;
      if (!id) return Response.json({ error: "Missing id" }, { status: 400 });
      await todoManager.delete(id);
      return { success: true };
    },
  };
}
