import { type LoaderFunctionArgs } from "@remix-run/cloudflare";
import { TodoManager } from "~/models/to-do-manager";

export async function loader({ request, context }: LoaderFunctionArgs) {
  const todoManager = new TodoManager(context.cloudflare.env.TO_DO_LIST);
  const encoder = new TextEncoder();
  const { signal } = request;

  const stream = new ReadableStream({
    async start(controller) {
      const send = (data: unknown, event?: string) => {
        try {
          let chunk = "";
          if (event) chunk += `event: ${event}\n`;
          chunk += `data: ${JSON.stringify(data)}\n\n`;
          controller.enqueue(encoder.encode(chunk));
        } catch (err) {
          console.error("Failed to send SSE data:", err);
        }
      };

      // 心跳
      const keepAlive = setInterval(() => {
        controller.enqueue(encoder.encode(`: ping ${Date.now()}\n\n`));
      }, 15000);

      // 轮询更新
      const poll = setInterval(async () => {
        if (signal.aborted) return; // 客户端关闭时停止
        try {
          const todos = await todoManager.list();
          send({ todos }, "todo_update");
        } catch (err) {
          console.error("Failed to fetch todos:", err);
        }
      }, 2000);

      // 监听 abort
      signal.addEventListener("abort", () => {
        clearInterval(keepAlive);
        clearInterval(poll);
        controller.close();
        console.log("SSE connection aborted");
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
