import { BasicIdea, Concept, ToDo } from './ideas';
import { NotificationService } from './notification-service';

type Idea = Concept | ToDo | BasicIdea;
// TODO: Remove values we dont want to be able to modify from this type
type AllIdeaParams = Concept & ToDo & BasicIdea;

export class IdeaService {
  private readonly constructorMap = {
    BasicIdea,
    ToDo,
    Concept,
  };
  private readonly repository: Idea[] = []; // This should hold all types of ideas.

  constructor(private readonly notificationService: NotificationService) {}

  /**
   * The ID we will give to the next idea to be created.
   */
  private currentId = 1;

  /**
   * Create and return a concrete instance of the idea type with the
   * given name and parameters.
   * Will store the concrete instance in the repository.
   * @param name
   * @param params
   * @returns idea
   */
  create<T extends keyof typeof this.constructorMap>(
    name: T,
    ...params: ConstructorParameters<typeof this.constructorMap[T]>
  ): InstanceType<typeof this.constructorMap[T]>;
  create(
    type: keyof typeof this.constructorMap,
    ...params: any[]
  ): InstanceType<
    typeof this.constructorMap[keyof typeof this.constructorMap]
  > {
    /**
     * For the purposes of this project, we are assuming all data
     * in the create and update params is valid and would otherwise
     * be caught by the TS linter. In a real system it might be coming
     * from an API or source we don't control, so we would want some kind of
     * validation/deserialisation to make sure it is always as expected.
     */
    const instance = new (this.constructorMap[type] as any)(...params);
    instance.id = this.currentId;
    this.currentId += 1;
    this.repository.push(instance);
    return instance;
  }

  /**
   * Perform a partial update of the idea with the given id with
   * the given mapping of updates. Will ignore update values not
   * part of the idea's type. Will call the notification service
   * for certain properties that are updated.
   * @param id
   * @param updates
   * @returns Promise<void>
   */
  update(id: number, updates: Partial<AllIdeaParams>): Promise<void> {
    const ideaIndex = this.repository.findIndex((idea) => idea.id === id);

    if (ideaIndex === -1) {
      return Promise.reject(`No Idea found with id ${id}`);
    }

    const idea = this.repository[ideaIndex];
    idea.update(updates);

    if (idea.shouldNotifyForChangedKey(Object.keys(updates))) {
      return this.notificationService.notify(idea);
    }

    return Promise.resolve();
  }

  /**
   * Return an array of all ideas in the repository matching the
   * given type.
   * @param type
   * @returns ideas
   */
  getAllByType<T extends keyof typeof this.constructorMap>(
    type: T
  ): InstanceType<typeof this.constructorMap[T]>[];
  getAllByType(
    type: keyof typeof this.constructorMap
  ): InstanceType<
    typeof this.constructorMap[keyof typeof this.constructorMap]
  >[] {
    return this.repository.filter(
      (instance) => instance.constructor.name === type
    );
  }
}
