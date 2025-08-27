import {
  type LoaderFunctionArgs,
  type ActionFunctionArgs,
} from "@remix-run/cloudflare";
import { useEffect, useState } from "react";

import { Sidebar, TodoPanel, ResourcePanel, MailboxPanel } from "~/components/id_components"
import { useLoaderData } from "@remix-run/react";

import { TodoManager } from "~/models/to-do-manager";
import { MailboxManager } from "~/models/mailbox-manager";
import { ResourceManager } from "~/models/resource-manager";

import { createTodoHandlers } from "~/handler/todoHandlers";
import { createResourceHandlers } from "~/handler/resourceHandlers";
import { createMailboxHandlers } from "~/handler/mailboxHandlers";

import { Todo } from "~/models/to-do-manager";
import { Resource } from "~/models/resource-manager";
import { Mailbox } from "~/models/mailbox-manager";

// loader is used to handle get request for a remix URL
// it's used to fetch all resources used to render the target html
// each successful action call will trigger loader to refresh the page
export async function loader({ context }: LoaderFunctionArgs) {
  const managers = {
    todo: new TodoManager(context.cloudflare.env.TO_DO_LIST),
    resource: new ResourceManager(context.cloudflare.env.RESOURCE_LIST),
    mailbox: new MailboxManager(context.cloudflare.env.MAILBOX_LIST),
  };
  await managers.todo.init();

  // 并行请求更高效
  const [todos, resources, mailboxes] = await Promise.all([
    managers.todo.list(),
    managers.resource.list(),
    managers.mailbox.list(),
  ]);

  return {
    todos,
    resources,
    mailboxes,
  };
}

// action is used to handle post request for a remix URL
// following request will contain a string to match to certain case
export async function action({ request, context }: ActionFunctionArgs) {
  const managers = {
    todo: new TodoManager(context.cloudflare.env.TO_DO_LIST),
    resource: new ResourceManager(context.cloudflare.env.RESOURCE_LIST),
    mailbox: new MailboxManager(context.cloudflare.env.MAILBOX_LIST),
  };

  const formData = await request.formData();
  const intent = formData.get("intent");

  if (typeof intent !== "string") {
    return Response.json({ error: "Missing intent" }, { status: 400 });
  }

  // 合并 handlers（外部定义）
  const handlers = {
    ...createTodoHandlers(managers.todo),
    ...createResourceHandlers(managers.resource),
    ...createMailboxHandlers(managers.mailbox),
  };

  type Intent = keyof typeof handlers;

  if (!(intent in handlers)) {
    return Response.json({ error: "Invalid intent" }, { status: 400 });
  }

  return handlers[intent as Intent](formData);
}

// The default function renders the page using data from the `loader`.
// In Remix, <Form> is used for any user action that changes backend data.
// When submitted, <Form> automatically sends an HTTP request to the server.
// For purely client-side interactions (like UI switching), normal JS event handlers are used.
// The parent (default) component holds shared state and passes update functions to child components.

// pooling default page
export default function IndexPage() {
  const [activePanel, setActivePanel] = useState("todo");

  // loader 初始数据
  const {
    todos: initialTodos,
    resources: initialResources,
    mailboxes: initialMailbox,
  } = useLoaderData<{ todos: any[]; resources: any[]; mailboxes: any[] }>();

  const [todos, setTodos] = useState<Todo[]>(initialTodos ?? []);
  const [resources, setResources] = useState<Resource[]>(initialResources ?? []);
  const [mailboxes, setMailbox] = useState<Mailbox[]>(initialMailbox ?? []);

  // 拉取最新数据
  const fetchAll = async () => {
    try {
      const res = await fetch("/pooling"); // 后端统一返回 { todos, resources, mailboxes }
      if (!res.ok) return;

      const data = (await res.json()) as { todos?: any[]; resources?: any[]; mailboxes?: any[] };
      if (data.todos) setTodos(data.todos);
      if (data.resources) setResources(data.resources);
      if (data.mailboxes) setMailbox(data.mailboxes);
    } catch (err) {
      console.error("Failed to fetch data:", err);
    }
  };

  // 一个定时器统一轮询
  useEffect(() => {
    const interval = setInterval(fetchAll, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex">
      <Sidebar activePanel={activePanel} setActivePanel={setActivePanel} />
      <div className="flex-1 p-8">
        {activePanel === "todo" && <TodoPanel todos={todos} />}
        {activePanel === "resource" && <ResourcePanel resources={resources} />}
        {activePanel === "mailbox" && <MailboxPanel mailboxes={mailboxes} />}
      </div>
    </div>
  );
}


// // SSE default page
// export default function IndexPage() {
//   const [activePanel, setActivePanel] = useState("todo");
//   const { todos: initialTodos } = useLoaderData<{ todos: any[] }>();
//   const [todos, setTodos] = useState<any[]>(initialTodos);
//   const [sseStatus, setSseStatus] = useState("connecting"); // 用于判断 SSE 是否可用

//   // set up sse stream
//   useEffect(() => {
//     const es = new EventSource("/stream"); // SSE loader 路径

//     const handleEvent = (e: MessageEvent) => {
//       try {
//         const data = JSON.parse(e.data);
//         if (data.todos) setTodos(data.todos);
//       } catch (err) {
//         console.error("Failed to parse SSE data:", err);
//       }
//     };

//     es.addEventListener("snapshot", handleEvent);
//     es.addEventListener("todo_update", handleEvent);

//     es.onerror = (err) => {
//       console.error("SSE error:", err);
//       setSseStatus("error");
//       es.close();
//     };

//     es.onopen = () => {
//       setSseStatus("connected");
//       console.log("SSE connected");
//     };

//     return () => es.close();
//   }, []);

//   return (
//     <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex">
//       <Sidebar activePanel={activePanel} setActivePanel={setActivePanel} />
//       <div className="flex-1 p-8">
//         <div className="mb-2 text-sm text-gray-500">
//           SSE Status: {sseStatus}
//         </div>
//         {activePanel === "todo" && <TodoPanel todos={todos} />}
//         {activePanel === "school" && <SchoolPanel />}
//         {activePanel === "contact" && <ContactPanel />}
//       </div>
//     </div>
//   );
// }