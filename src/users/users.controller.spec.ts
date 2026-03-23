import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { NotFoundException } from '@nestjs/common/exceptions';

describe('UsersController', () => {
  let controller: UsersController;
  let fakeUsersService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>;
  beforeEach(async () => {
    fakeUsersService = {
      findOne: (id: number) => {
        return Promise.resolve({
          id,
          email: 'test@test.com',
          password: 'test',
        } as User);
      },
      find: (email: string) => {
        return Promise.resolve([
          {
            id: 1,
            email,
            password: 'test',
          } as User,
        ]);
      },
      remove: (id: number) => {
        return Promise.resolve({
          id,
          email: 'test@test.com',
          password: 'test',
        } as User);
      },
      // update: (id: number, attrs: Partial<User>) => {
      //   return Promise.resolve({ id, attrs });
      // },
    };
    fakeAuthService = {
      // signUp: () => {},
      signIn: (email: string, password: string) => {
        return Promise.resolve({ id: 10, email, password } as User);
      },
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
        {
          provide: AuthService,
          useValue: fakeAuthService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it(' findUser throws an error if user with given id does not exist', async () => {
    fakeUsersService.findOne = () => null;
    await expect(controller.findUser('1')).rejects.toThrow(NotFoundException);
  });

  it('returns all users with this email', async () => {
    const users = await controller.findAllUsers('test@test.com');
    expect(users.length).toEqual(1);
    expect(users[0].email).toEqual('test@test.com');
  });
  it('findUser returns only 1 user with a given id', async () => {
    const user = controller.findUser('1');
    await expect(user).toBeDefined();
  });
  it('signning in user with given email and password', async () => {
    const session = { userId: 5 };
    const user = await controller.loginUser(
      {
        email: 'test@test.com',
        password: 'test',
      },
      session,
    );
    expect(user.id).toEqual(10);
    expect(session.userId).toEqual(10);
  });
});
