import { useLoaderData, Form } from "@remix-run/react";

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
        {["todo", "school", "contact"].map((panel) => (
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
                : panel === "school"
                ? "School Resource"
                : "Contact"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

// Todo 面板
export function TodoPanel({ todos }: { todos: any[] }) {
  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">
        Todo List
      </h1>

      <Form method="post" className="mb-8 flex gap-2">
        <input
          type="text"
          name="text"
          className="flex-1 rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white shadow-sm px-4 py-2"
          placeholder="Add a new todo..."
        />
        <button
          type="submit"
          name="intent"
          value="create"
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
        >
          Add
        </button>
      </Form>

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
                value="toggle"
                className="text-gray-500 hover:text-blue-500"
              >
                <span
                  className={
                    todo.completed ? "line-through text-gray-400" : ""
                  }
                >
                  {todo.text}
                </span>
              </button>
            </Form>

            <Form method="post">
              <input type="hidden" name="id" value={todo.id} />
              <button
                type="submit"
                name="intent"
                value="delete"
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

// School 面板
export function SchoolPanel() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
        School Resource
      </h1>
      <p className="mt-4 text-gray-600 dark:text-gray-300">（内容待添加）</p>
    </div>
  );
}

// Contact 面板
export function ContactPanel() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
        Contact
      </h1>
      <p className="mt-4 text-gray-600 dark:text-gray-300">（内容待添加）</p>
    </div>
  );
}