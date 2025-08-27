export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
  dueTime: number; // 新增时间字段
}

export class TodoManager {
  constructor(
    private kv: KVNamespace,
    private todosKey: string = "todos",
  ) {}

  /** 初始化 KV 数据，清理过期任务 */
  async init(): Promise<void> {
    const todos = await this.kv.get(this.todosKey, "json") as Todo[] | null;
    if (!todos || !Array.isArray(todos)) return;

    const now = Date.now();
    const filtered = todos.filter(todo => !todo.dueTime || todo.dueTime >= now);
    if (filtered.length !== todos.length) {
      await this.kv.put(this.todosKey, JSON.stringify(filtered));
    }
  }

  /** 获取所有未过期任务 */
  async list(): Promise<Todo[]> {
    const todos = await this.kv.get(this.todosKey, "json") as Todo[] | null;
    const now = Date.now();
    const validTodos = (Array.isArray(todos) ? todos : []).filter(todo => !todo.dueTime || todo.dueTime >= now);
    validTodos.sort((a, b) => {
      // 优先按 dueTime 排序，其次按创建时间
      const timeA = a.dueTime || a.createdAt;
      const timeB = b.dueTime || b.createdAt;
      return timeA - timeB;
    });
    return validTodos;
  }

  /** 创建任务，接收时间参数 */
  async create(text: string, dueTime: number): Promise<Todo> {
    if (!dueTime || dueTime <= 0) {
      throw new Error("Todo must have a valid dueTime");
    }

    const newTodo: Todo = {
      id: crypto.randomUUID(),
      text,
      completed: false,
      createdAt: Date.now(),
      dueTime,
    };

    const todos = await this.list();
    todos.push(newTodo);
    await this.kv.put(this.todosKey, JSON.stringify(todos));
    return newTodo;
  }

  /** 切换完成状态 */
  async toggle(id: string): Promise<Todo> {
    const todos = await this.list();
    const index = todos.findIndex(todo => todo.id === id);
    if (index === -1) throw new Error(`Todo with id ${id} not found`);

    todos[index].completed = !todos[index].completed;
    await this.kv.put(this.todosKey, JSON.stringify(todos));
    return todos[index];
  }

  /** 删除任务 */
  async delete(id: string): Promise<void> {
    const todos = await this.list();
    const filtered = todos.filter(todo => todo.id !== id);
    await this.kv.put(this.todosKey, JSON.stringify(filtered));
  }
}
