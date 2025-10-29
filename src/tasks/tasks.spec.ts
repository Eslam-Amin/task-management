import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { TaskStatus } from './task-status.enum';
import { NotFoundException } from '@nestjs/common';

const mockTasksRepository = () => ({
  getTasks: jest.fn(),
  getTasksWithCount: jest.fn(),
  findOne: jest.fn(),
});

const mockUser = {
  id: 'someid',
  username: 'JohnDoe',
  password: 'somePassword',
  tasks: [],
};

describe('Tasks Service', () => {
  let tasksService: TasksService;
  let tasksRepository;

  beforeEach(async () => {
    // Initialize a NestJS Module with the TasksService and a mock TasksRepository
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: 'TASKS_REPOSITORY',
          useFactory: mockTasksRepository,
        },
      ],
    }).compile();
    tasksService = module.get<TasksService>(TasksService);
    tasksRepository = module.get('TASKS_REPOSITORY');
  });

  describe('Get Tasks', () => {
    it('calls tasksRepository.getTasks and returns the result', async () => {
      const mockResult = {
        tasks: [
          { id: 'task id', title: 'Test task', description: 'Test desc' },
        ],
        tasksCount: 1,
      };
      tasksRepository.getTasksWithCount.mockResolvedValue(mockResult);

      // Call TesksService.getTasks, which should then call the repository's get Tasks
      const result = await tasksService.getAllTasks({}, mockUser);
      expect(tasksRepository.getTasksWithCount).toHaveBeenCalled();
      expect(result).toEqual(mockResult);
    });
  });

  describe('Get Tasks By ID', () => {
    it('calls tasksRepository.getTasksById and returns the result', async () => {
      const mockTask = {
        id: 'task id',
        title: 'Test task',
        description: 'Test desc',
        status: TaskStatus.OPEN,
      };
      tasksRepository.findOne.mockResolvedValue(mockTask);

      // Call TesksService.getTasks, which should then call the repository's get Tasks
      const result = await tasksService.getTaskById('task id', mockUser);
      expect(tasksRepository.findOne).toHaveBeenCalled();
      expect(result).toEqual(mockTask);
    });
    it('calls tasksRepository.getTasksById and handles error', async () => {
      tasksRepository.findOne.mockResolvedValue(null);

      // Call TesksService.getTasks, which should then call the repository's get Tasks
      expect(tasksRepository.findOne).not.toHaveBeenCalled();
      expect(tasksService.getTaskById('task id', mockUser)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
