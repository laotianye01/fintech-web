import { ResourceManager } from "~/models/resource-manager";

export function createResourceHandlers(resourceManager: ResourceManager) {
  return {
    resource_create: async (fd: FormData) => {
      const text = fd.get("text");
      if (typeof text !== "string" || !text) {
        return Response.json({ error: "Invalid resource text" }, { status: 400 });
      }
      await resourceManager.create(text);
      return { success: true };
    },
    resource_delete: async (fd: FormData) => {
      const id = fd.get("id") as string;
      await resourceManager.delete(id);
      return { success: true };
    }
  };
}
