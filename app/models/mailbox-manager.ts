export interface Mailbox {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
}

export class MailboxManager {
  constructor(
    private kv: KVNamespace,
    private mailboxesKey: string = "mailboxes",
  ) {}

  async list(): Promise<Mailbox[]> {
    const mailboxes = await this.kv.get(this.mailboxesKey, "json");
    if (Array.isArray(mailboxes)) {
      mailboxes.sort((a: Mailbox, b: Mailbox) => b.createdAt - a.createdAt);
    }
    return (mailboxes || []) as Mailbox[];
  }

  async create(text: string): Promise<Mailbox> {
    const newMailbox: Mailbox = {
      id: crypto.randomUUID(),
      text,
      completed: false,
      createdAt: Date.now(),
    };
    const mailboxes = await this.list();
    mailboxes.push(newMailbox);
    await this.kv.put(this.mailboxesKey, JSON.stringify(mailboxes));
    return newMailbox;
  }

  async toggle(id: string): Promise<Mailbox> {
    const mailboxes = await this.list();
    const mailboxIndex = mailboxes.findIndex((mailbox) => mailbox.id === id);
    if (mailboxIndex === -1) {
      throw new Error(`Mailbox with id ${id} not found`);
    }
    mailboxes[mailboxIndex].completed = !mailboxes[mailboxIndex].completed;
    await this.kv.put(this.mailboxesKey, JSON.stringify(mailboxes));
    return mailboxes[mailboxIndex];
  }

  async delete(id: string): Promise<void> {
    const mailboxes = await this.list();
    const newMailboxes = mailboxes.filter((mailbox) => mailbox.id !== id);
    await this.kv.put(this.mailboxesKey, JSON.stringify(newMailboxes));
  }
}
