import { IdeaService } from './idea-service';

const mockNotificationService = { notify: jest.fn() };

describe('IdeaService', () => {
  describe('create', () => {
    it('Can add a ToDo to the repository', () => {
      const service = new IdeaService(mockNotificationService);
      const returnVal = service.create('ToDo', {
        description: 'A todo description',
        title: 'My todo',
        done: false,
      });

      const concreteTodo = {
        id: 1,
        description: 'A todo description',
        title: 'My todo',
        done: false,
      };

      expect(returnVal).toEqual(concreteTodo);
    });

    it('Can add a BasicIdea to the repository', () => {
      const service = new IdeaService(mockNotificationService);
      const returnVal = service.create('BasicIdea', {
        description: 'A todo description',
        title: 'My todo',
      });

      const concreteBasicIdea = {
        id: 1,
        description: 'A todo description',
        title: 'My todo',
      };

      expect(returnVal).toEqual(concreteBasicIdea);
    });

    it('Can add a Concept to the repository', () => {
      const service = new IdeaService(mockNotificationService);
      const returnVal = service.create('Concept', {
        description: 'A todo description',
        title: 'My todo',
        done: false,
        references: ['www.site.com'],
      });

      const concreteConcept = {
        id: 1,
        description: 'A todo description',
        title: 'My todo',
        done: false,
        references: ['www.site.com'],
      };

      expect(returnVal).toEqual(concreteConcept);
    });

    it('Increments the ID of the created ideas', () => {
      const service = new IdeaService(mockNotificationService);
      service.create('Concept', {
        description: 'A todo description',
        title: 'My todo',
        done: false,
        references: ['www.site.com'],
      });

      const returnVal = service.create('ToDo', {
        description: 'A todo description',
        title: 'My todo',
        done: false,
      });

      const concreteTodo = {
        id: 2,
        description: 'A todo description',
        title: 'My todo',
        done: false,
      };

      expect(returnVal).toEqual(concreteTodo);
    });
  });

  describe('getAllByType', () => {
    const serviceWithMultipleIdeas = new IdeaService(mockNotificationService);
    const concept = serviceWithMultipleIdeas.create('Concept', {
      description: 'A todo description',
      title: 'My todo',
      done: false,
      references: ['www.site.com'],
    });
    const todo = serviceWithMultipleIdeas.create('ToDo', {
      description: 'A todo description',
      title: 'My todo',
      done: false,
    });
    const basicIdea = serviceWithMultipleIdeas.create('BasicIdea', {
      description: 'A todo description',
      title: 'My todo',
    });

    it.each<[any, any]>(
      // type, expected
      [
        ['Concept', [concept]],
        ['ToDo', [todo]],
        ['BasicIdea', [basicIdea]],
      ]
    )('Gets %ss by type', (type, expected) => {
      expect(serviceWithMultipleIdeas.getAllByType(type)).toEqual(expected);
    });

    it('Gets ideas by type when there are multiple ideas of the same type', () => {
      const serviceWithMultipleIdeas = new IdeaService(mockNotificationService);
      const concept1 = serviceWithMultipleIdeas.create('Concept', {
        description: 'A concept',
        title: 'Concept 1',
        done: false,
        references: ['www.site.com'],
      });
      const concept2 = serviceWithMultipleIdeas.create('Concept', {
        description: 'Another concept',
        title: 'Concept 2',
        done: false,
        references: ['www.anothersite.com'],
      });

      expect(serviceWithMultipleIdeas.getAllByType('Concept')).toEqual([
        concept1,
        concept2,
      ]);
    });
  });

  describe('update', () => {
    it('Throws an error if no idea with the passed in ID exists', async () => {
      const service = new IdeaService(mockNotificationService);
      await expect(service.update(1, { done: true })).rejects.toEqual(
        'No Idea found with id 1'
      );
    });

    it('Updates the idea with the id with the passed in values', async () => {
      const service = new IdeaService(mockNotificationService);

      await service.update(1, { title: 'A new title' });

      const expectedUpdatedConcept = {
        id: 1,
        description: 'A todo description',
        title: 'A new title',
        done: false,
        references: ['www.site.com'],
      };

      const updatedConcept = service.getAllByType('Concept')[0];

      expect(updatedConcept).toEqual(expectedUpdatedConcept);
    });

    it('Does not call the notifier for a non notifiable value', async () => {
      const service = new IdeaService(mockNotificationService);

      await service.update(1, { title: 'A new title' });

      expect(mockNotificationService.notify).toHaveBeenCalledTimes(0);
    });

    it('Calls the notifier for a notifiable value', async () => {
      const service = new IdeaService(mockNotificationService);

      await service.update(1, { references: ['www.anewsite.com'] });

      expect(mockNotificationService.notify).toHaveBeenCalledTimes(1);
    });
  });
});
