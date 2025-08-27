import { MailboxManager } from "~/models/mailbox-manager";

export function createMailboxHandlers(mailboxManager: MailboxManager) {
  return {
    mailbox_create: async (fd: FormData) => {
      const text = fd.get("text");
      if (typeof text !== "string" || !text) {
        return Response.json({ error: "Invalid mailbox text" }, { status: 400 });
      }
      await mailboxManager.create(text);
      return { success: true };
    },
    mailbox_delete: async (fd: FormData) => {
      const id = fd.get("id") as string;
      await mailboxManager.delete(id);
      return { success: true };
    },
  };
}
