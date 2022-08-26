export class BasicIdea {
  get keysToNotifyForOnChange() {
    return ['title'];
  }

  id?: number;
  description: string;
  title: string;

  constructor({ description, title }: { description: string; title: string }) {
    this.description = description;
    this.title = title;
  }

  update({ description, title }: { description?: string; title?: string }) {
    this.description = description || this.description;
    this.title = title || this.title;
  }

  shouldNotifyForChangedKey(keys: string[]) {
    return this.keysToNotifyForOnChange.some((keyToNotifyFor) =>
      keys.includes(keyToNotifyFor)
    );
  }
}

export class ToDo extends BasicIdea {
  get keysToNotifyForOnChange() {
    return ['done'];
  }

  done: boolean;

  constructor({
    description,
    title,
    done = false,
  }: {
    description: string;
    title: string;
    done: boolean;
  }) {
    super({ description, title });
    this.done = done;
  }

  update({
    description,
    title,
    done,
  }: {
    description?: string;
    title?: string;
    done?: boolean;
  }) {
    this.description = description || this.description;
    this.title = title || this.title;
    this.done = done || this.done;
  }
}

export class Concept extends ToDo {
  references: string[];

  get keysToNotifyForOnChange() {
    return ['references'];
  }

  constructor({
    description,
    title,
    done = false,
    references,
  }: {
    description: string;
    title: string;
    done: boolean;
    references: string[];
  }) {
    super({ description, title, done });
    this.references = references;
  }

  update({
    description,
    title,
    done,
    references,
  }: {
    description?: string;
    title?: string;
    done?: boolean;
    references?: string[];
  }) {
    this.description = description || this.description;
    this.title = title || this.title;
    this.done = done || this.done;
    this.references = references || this.references;
  }
}
