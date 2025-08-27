import { TodoManager } from "~/models/to-do-manager";

export function createTodoHandlers(todoManager: TodoManager) {
  return {
    todo_create: async (fd: FormData) => {
      const text = fd.get("text");
      const dateStr = fd.get("time"); // "YYYY-MM-DD"

      if (typeof text !== "string" || !text) {
        return Response.json({ error: "Invalid text" }, { status: 400 });
      }

      // 如果没有填写日期，也返回一个错误提示
      if (typeof dateStr !== "string" || dateStr.trim() === "") {
        return Response.json({ error: "Due time is required" }, { status: 400 });
      }

      // 自动补上 23:59
      const date = new Date(dateStr);
      date.setHours(23, 59, 0, 0);
      const dueTime = date.getTime();

      await todoManager.create(text, dueTime);
      // 确保返回一个有效的 Response 对象
      return Response.json({ success: true });
    },

    todo_delete: async (fd: FormData) => {
      const id = fd.get("id") as string;
      if (!id) return Response.json({ error: "Missing id" }, { status: 400 });
      await todoManager.delete(id);
      return { success: true };
    },
  };
}
