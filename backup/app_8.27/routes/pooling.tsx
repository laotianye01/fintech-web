import { type LoaderFunctionArgs, json } from "@remix-run/cloudflare";
import { TodoManager } from "~/models/to-do-manager";
import { ResourceManager } from "~/models/resource-manager";
import { MailboxManager } from "~/models/mailbox-manager";

export async function loader({ context }: LoaderFunctionArgs) {
  const todoManager = new TodoManager(context.cloudflare.env.TO_DO_LIST);
  const resourceManager = new ResourceManager(context.cloudflare.env.RESOURCE_LIST);
  const mailboxManager = new MailboxManager(context.cloudflare.env.MAILBOX_LIST);

  const [todos, resources, mailboxes] = await Promise.all([
    todoManager.list(),
    resourceManager.list(),
    mailboxManager.list(),
  ]);
  
  return new Response(JSON.stringify({ todos, resources, mailboxes }), {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-cache",
    },
  });
}
