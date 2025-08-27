import { useLoaderData, Form } from "@remix-run/react";
import { Todo } from "~/models/to-do-manager";
import { Resource } from "~/models/resource-manager";
import { Mailbox } from "~/models/mailbox-manager";

// 左侧菜单栏
export function Sidebar({ activePanel, setActivePanel }: { 
  activePanel: string; 
  setActivePanel: (panel: string) => void;
}) {
  return (
    <div className="w-64 bg-white dark:bg-gray-800 shadow-lg p-6">
      <h2 className="text-xl font-bold mb-6 text-gray-800 dark:text-white">
        Menu
      </h2>
      <ul className="space-y-4">
        {["todo", "resource", "mailbox"].map((panel) => (
          <li key={panel}>
            <button
              onClick={() => setActivePanel(panel)}
              className={`w-full text-left px-4 py-2 rounded-lg transition ${
                activePanel === panel
                  ? "bg-blue-500 text-white"
                  : "text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              {panel === "todo"
                ? "Todo List"
                : panel === "resource"
                ? "Resource"
                : "Contact"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

// Todo 面板（action 对应 handler）
export function TodoPanel({ todos }: { todos: Todo[] }) {
  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">
        Todo List
      </h1>

      {/* 添加任务表单 */}
      <Form method="post" className="mb-8 flex gap-2">
        <input
          type="text"
          name="text"
          className="flex-1 rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white shadow-sm px-4 py-2"
          placeholder="Add a new todo..."
        />
        <input
          type="date"
          name="time"
          className="rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white shadow-sm px-4 py-2"
        />
        <button
          type="submit"
          name="intent"
          value="todo_create" // 对应 TodoManager.create handler
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
        >
          Add
        </button>
      </Form>

      {/* 任务列表 */}
      <ul className="space-y-2">
        {todos.map((todo) => (
          <li
            key={todo.id}
            className="flex items-center gap-2 bg-white dark:bg-gray-800 p-4 rounded-lg shadow"
          >
            <Form method="post" className="flex-1 flex items-center gap-2">
              <input type="hidden" name="id" value={todo.id} />
              <button
                type="submit"
                name="intent"
                value="todo_toggle" // 对应 TodoManager.toggle
                className="text-gray-500 hover:text-blue-500"
              >
                <span
                  className={todo.completed ? "line-through text-gray-400" : ""}
                >
                  {todo.text}
                </span>
              </button>
              <span className="ml-auto text-gray-400 text-sm">
                {todo.dueTime ? new Date(todo.dueTime).toLocaleString() : new Date(todo.createdAt).toLocaleString()}
              </span>
            </Form>

            <Form method="post">
              <input type="hidden" name="id" value={todo.id} />
              <button
                type="submit"
                name="intent"
                value="todo_delete" // 对应 TodoManager.delete
                className="text-red-500 hover:text-red-700"
              >
                Delete
              </button>
            </Form>
          </li>
        ))}
      </ul>
    </div>
  );
};

// Resource 面板
export function ResourcePanel({ resources }: { resources?: Resource[] }) {
  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">
        Resources
      </h1>

      {/* 添加资源表单 */}
      <Form method="post" className="mb-8 flex gap-2">
        <input
          type="text"
          name="text"
          className="flex-1 rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white shadow-sm px-4 py-2"
          placeholder="Add a new resource..."
        />
        <button
          type="submit"
          name="intent"
          value="resource_create" // 对应 handler
          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
        >
          Add
        </button>
      </Form>

      {/* 资源列表 */}
      <ul className="space-y-2">
        {resources?.map((res) => (
          <li
            key={res.id}
            className="flex items-center gap-2 bg-white dark:bg-gray-800 p-4 rounded-lg shadow"
          >
            <span className="flex-1 text-gray-800 dark:text-white">{res.text}</span>
            <Form method="post">
              <input type="hidden" name="id" value={res.id} />
              <button
                type="submit"
                name="intent"
                value="resource_delete" // 对应 handler
                className="text-red-500 hover:text-red-700"
              >
                Delete
              </button>
            </Form>
          </li>
        ))}
      </ul>
    </div>
  );
}

// Mailbox / Contact 面板
export function MailboxPanel({ mailboxes }: { mailboxes?: Mailbox[] }) {
  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">
        Mailbox
      </h1>

      {/* 添加邮箱条目表单 */}
      <Form method="post" className="mb-8 flex gap-2">
        <input
          type="text"
          name="text"
          className="flex-1 rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white shadow-sm px-4 py-2"
          placeholder="Add a new mailbox entry..."
        />
        <button
          type="submit"
          name="intent"
          value="mailbox_create" // 对应 handler
          className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition"
        >
          Add
        </button>
      </Form>

      {/* 邮箱列表 */}
      <ul className="space-y-2">
        {mailboxes?.map((mailbox) => (
          <li
            key={mailbox.id}
            className="flex items-center gap-2 bg-white dark:bg-gray-800 p-4 rounded-lg shadow"
          >
            <span className="flex-1 text-gray-800 dark:text-white">{mailbox.text}</span>
            <Form method="post">
              <input type="hidden" name="id" value={mailbox.id} />
              <button
                type="submit"
                name="intent"
                value="mailbox_delete" // 对应 handler
                className="text-red-500 hover:text-red-700"
              >
                Delete
              </button>
            </Form>
          </li>
        ))}
      </ul>
    </div>
  );
}