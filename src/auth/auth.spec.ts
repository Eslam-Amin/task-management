import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { mock } from 'node:test';

const mockUsersRepository = () => ({
  createUser: jest.fn(),
  findOne: jest.fn(),
});

const mockJwtService = () => ({
  sign: jest.fn(),
  verify: jest.fn(),
});

describe('Auth Service', () => {
  let authService: AuthService;
  let usersRepository;
  let jwtService;
  beforeEach(async () => {
    // Initialize a NestJS Module with the AuthService and a mock AuthRepository
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: 'USERS_REPOSITORY',
          useFactory: mockUsersRepository,
        },
        {
          provide: JwtService,
          useFactory: mockJwtService,
        },
      ],
    }).compile();
    authService = module.get<AuthService>(AuthService);
    usersRepository = module.get('USERS_REPOSITORY');
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('Auth Service Initialization', () => {
    it('should be defined', () => {
      expect(authService).toBeDefined();
    });
  });

  describe('signs up a user', () => {
    it('calls usersRepository.createUser and returns the result', async () => {
      const mockUser = {
        username: 'TestUser',
        password: 'TestPassword',
      };
      usersRepository.createUser.mockResolvedValue(mockUser);
      const result = await authService.signUp(mockUser);

      expect(usersRepository.createUser).toHaveBeenCalledWith(mockUser);
      expect(result).toEqual(mockUser);
    });

    it('signs up a user and hashes the password', async () => {
      const mockUser = {
        username: 'TestUser',
        password: 'TestPassword',
      };
      usersRepository.createUser.mockResolvedValue({
        ...mockUser,
        password: bcrypt.hashSync(mockUser.password, 10),
      });

      const result = await authService.signUp(mockUser);

      expect(result.password).not.toEqual(mockUser.password);

      const isPasswordMatching = await bcrypt.compare(
        mockUser.password,
        result.password,
      );
      expect(isPasswordMatching).toBe(true);
    });
  });

  describe('signs in a user', () => {
    it('calls usersRepository.findOne and returns a JWT token', async () => {
      const mockUser = {
        id: 'someid',
        username: 'TestUser',
        password: bcrypt.hashSync('TestPassword', 10),
      };
      usersRepository.findOne.mockResolvedValue(mockUser);
      const mockToken = 'sometoken';
      jwtService.sign.mockResolvedValue(mockToken);

      const result = await authService.signIn({
        username: mockUser.username,
        password: 'TestPassword',
      });

      expect(usersRepository.findOne).toHaveBeenCalledWith({
        where: { username: mockUser.username },
      });

      expect(jwtService.sign).toHaveBeenCalledWith({
        username: mockUser.username,
      });
      expect(result).toEqual({ accessToken: mockToken, user: mockUser });
    });

    it('throws an error if credentials are invalid', async () => {
      const mockUser = {
        id: 'someid',
        username: 'TestUser',
        password: bcrypt.hashSync('TestPassword', 10),
      };
      usersRepository.findOne.mockResolvedValue(mockUser);

      await expect(
        authService.signIn({
          username: mockUser.username,
          password: 'WrongPassword',
        }),
      ).rejects.toThrow('Invalid credentials');
    });
  });
});
