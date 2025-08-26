import {
  type LoaderFunctionArgs,
  type ActionFunctionArgs,
} from "@remix-run/cloudflare";
import { useLoaderData, Form } from "@remix-run/react";
import { useState } from "react";

import { TodoManager } from "~/models/to-do-manager";
import { Sidebar, TodoPanel, SchoolPanel, ContactPanel } from "~/components/id_components"

// loader is used to handle get request for a remix URL
// it's used to fetch all resources used to render the target html
// each successful action call will trigger loader to refresh the page
export const loader = async ({ params, context }: LoaderFunctionArgs) => {
  const todoManager = new TodoManager(
    context.cloudflare.env.TO_DO_LIST,
    params.id,
  );
  const todos = await todoManager.list();
  return { todos };
};

// action is used to handle post request for a remix URL
// following request will contain a string to match to certain case
export async function action({ request, context, params }: ActionFunctionArgs) {
  const todoManager = new TodoManager(
    context.cloudflare.env.TO_DO_LIST,
    params.id,
  );
  const formData = await request.formData();
  const intent = formData.get("intent");

  switch (intent) {
    case "create": {
      const text = formData.get("text");
      if (typeof text !== "string" || !text)
        return Response.json({ error: "Invalid text" }, { status: 400 });
      await todoManager.create(text);
      return { success: true };
    }

    case "toggle": {
      const id = formData.get("id") as string;
      await todoManager.toggle(id);
      return { success: true };
    }

    case "delete": {
      const id = formData.get("id") as string;
      await todoManager.delete(id);
      return { success: true };
    }

    default:
      return Response.json({ error: "Invalid intent" }, { status: 400 });
  }
}

// default function renders the page using data from the `loader` function.
// In Remix, the `<Form>` component handles user interaction.
// When a user submits the form, `<Form>` automatically sends an HTTP request to the backend.
export default function MainPage() {
  const { todos } = useLoaderData<typeof loader>();
  const [activePanel, setActivePanel] = useState("todo");

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex">
      {/* 左侧菜单栏 */}
      <Sidebar activePanel={activePanel} setActivePanel={setActivePanel} />

      {/* 右侧内容 */}
      <div className="flex-1 p-8">
        {activePanel === "todo" && <TodoPanel todos={todos} />}
        {activePanel === "school" && <SchoolPanel />}
        {activePanel === "contact" && <ContactPanel />}
      </div>
    </div>
  );
}
