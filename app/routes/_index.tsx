import {
  type LoaderFunctionArgs,
  type ActionFunctionArgs,
} from "@remix-run/cloudflare";
import { useEffect, useState } from "react";

import { TodoManager } from "~/models/to-do-manager";
import { Sidebar, TodoPanel, SchoolPanel, ContactPanel } from "~/components/id_components"
import { useLoaderData } from "@remix-run/react";

// loader is used to handle get request for a remix URL
// it's used to fetch all resources used to render the target html
// each successful action call will trigger loader to refresh the page
export async function loader({ context }: LoaderFunctionArgs) {
  const todoManager = new TodoManager(context.cloudflare.env.TO_DO_LIST);
  const todos = await todoManager.list();
  return { todos };
}

// action is used to handle post request for a remix URL
// following request will contain a string to match to certain case
export async function action({ request, context }: ActionFunctionArgs) {
  const todoManager = new TodoManager(context.cloudflare.env.TO_DO_LIST);
  const formData = await request.formData();
  const intent = formData.get("intent");

  switch (intent) {
    case "todo_create": {
      const text = formData.get("text");
      if (typeof text !== "string" || !text) {
        return Response.json({ error: "Invalid text" }, { status: 400 });
      }
      await todoManager.create(text);
      return { success: true };
    }
    case "todo_toggle": {
      const id = formData.get("id") as string;
      await todoManager.toggle(id);
      return { success: true };
    }
    case "todo_delete": {
      const id = formData.get("id") as string;
      await todoManager.delete(id);
      return { success: true };
    }
    default:
      return Response.json({ error: "Invalid intent" }, { status: 400 });
  }
}

// The default function renders the page using data from the `loader`.
// In Remix, <Form> is used for any user action that changes backend data.
// When submitted, <Form> automatically sends an HTTP request to the server.
// For purely client-side interactions (like UI switching), normal JS event handlers are used.
// The parent (default) component holds shared state and passes update functions to child components.
export default function IndexPage() {
  const [activePanel, setActivePanel] = useState("todo");
  const { todos: initialTodos } = useLoaderData<{ todos: any[] }>();
  const [todos, setTodos] = useState<any[]>(initialTodos);

  useEffect(() => {
    // SSE 使用固定路径
    const es = new EventSource(`/stream`);
    const handleEvent = (e: MessageEvent) => {
      try {
        const data = JSON.parse(e.data);
        if (data.todos) setTodos(data.todos);
      } catch {}
    };

    es.addEventListener("snapshot", handleEvent);
    es.addEventListener("todo_update", handleEvent);

    return () => es.close();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex">
      <Sidebar activePanel={activePanel} setActivePanel={setActivePanel} />
      <div className="flex-1 p-8">
        {activePanel === "todo" && <TodoPanel todos={todos} />}
        {activePanel === "school" && <SchoolPanel />}
        {activePanel === "contact" && <ContactPanel />}
      </div>
    </div>
  );
}