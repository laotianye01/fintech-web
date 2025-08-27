import { type LoaderFunctionArgs } from "@remix-run/cloudflare";
import { TodoManager } from "~/models/to-do-manager";

export async function loader({ context }: LoaderFunctionArgs) {
  const todoManager = new TodoManager(context.cloudflare.env.TO_DO_LIST);
  const todos = await todoManager.list();
  return new Response(JSON.stringify({ todos }), {
    headers: { "Content-Type": "application/json" },
  });
}