export interface Resource {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
}

export class ResourceManager {
  constructor(
    private kv: KVNamespace,
    private resourcesKey: string = "resources",
  ) {}

  async list(): Promise<Resource[]> {
    const resources = await this.kv.get(this.resourcesKey, "json");
    if (Array.isArray(resources)) {
      resources.sort((a: Resource, b: Resource) => b.createdAt - a.createdAt);
    }
    return (resources || []) as Resource[];
  }

  async create(text: string): Promise<Resource> {
    const newResource: Resource = {
      id: crypto.randomUUID(),
      text,
      completed: false,
      createdAt: Date.now(),
    };
    const resources = await this.list();
    resources.push(newResource);
    await this.kv.put(this.resourcesKey, JSON.stringify(resources));
    return newResource;
  }

  async toggle(id: string): Promise<Resource> {
    const resources = await this.list();
    const resourceIndex = resources.findIndex((resource) => resource.id === id);
    if (resourceIndex === -1) {
      throw new Error(`Resource with id ${id} not found`);
    }
    resources[resourceIndex].completed = !resources[resourceIndex].completed;
    await this.kv.put(this.resourcesKey, JSON.stringify(resources));
    return resources[resourceIndex];
  }

  async delete(id: string): Promise<void> {
    const resources = await this.list();
    const newResource = resources.filter((resource) => resource.id !== id);
    await this.kv.put(this.resourcesKey, JSON.stringify(newResource));
  }
}
