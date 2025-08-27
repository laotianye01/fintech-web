import { type LoaderFunctionArgs } from "@remix-run/cloudflare";
import { TodoManager } from "~/models/to-do-manager";

export async function loader({ request, context }: LoaderFunctionArgs) {
  const todoManager = new TodoManager(context.cloudflare.env.TO_DO_LIST);
  const encoder = new TextEncoder();
  const { signal } = request;

  const stream = new ReadableStream({
    async start(controller) {
      const send = (data: unknown, event?: string) => {
        let chunk = "";
        if (event) chunk += `event: ${event}\n`;
        chunk += `data: ${JSON.stringify(data)}\n\n`;
        controller.enqueue(encoder.encode(chunk));
      };

      // 首次推送快照
      const todos = await todoManager.list();
      send({ todos }, "snapshot");

      // 心跳
      const keepAlive = setInterval(() => {
        controller.enqueue(encoder.encode(`: ping ${Date.now()}\n\n`));
      }, 15000);

      // 轮询更新
      const poll = setInterval(async () => {
        const todos = await todoManager.list();
        send({ todos }, "todo_update");
      }, 5000);

      signal.addEventListener("abort", () => {
        clearInterval(keepAlive);
        clearInterval(poll);
        controller.close();
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
    },
  });
}
