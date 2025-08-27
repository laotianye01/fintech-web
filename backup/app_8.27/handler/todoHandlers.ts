import { TodoManager } from "~/models/to-do-manager";

export function createTodoHandlers(todoManager: TodoManager) {
  return {
    todo_create: async (fd: FormData) => {
      const text = fd.get("text");
      const timeStr = fd.get("time"); // 新增时间字段

      if (typeof text !== "string" || !text) {
        return Response.json({ error: "Invalid text" }, { status: 400 });
      }

      if (typeof timeStr !== "string" || isNaN(Date.parse(timeStr))) {
        return Response.json({ error: "Invalid time format" }, { status: 400 });
      }

      const time = new Date(timeStr).getTime();
      await todoManager.create(text, time);
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
