import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    //Create a fake copy of the users service

    //Partial <> to use the annotation of UsersService
    const users: User[] = [];
    fakeUsersService = {
      find: (email: string) => {
        const filteredUsers = users.filter((user) => user.email === email);
        return Promise.resolve(filteredUsers);
      },

      create: (email: string, password: string) => {
        const user = {
          id: Math.floor(Math.random() * 9999),
          email,
          password,
        } as User;
        users.push(user);
        return Promise.resolve(user);
      },
    };

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: fakeUsersService },
      ],
    }).compile();
    service = module.get(AuthService);
  });

  it('Can create an instance of auth service', async () => {
    expect(service).toBeDefined();
  });

  it('Creates a new user with a salted and hashed password', async () => {
    const user = await service.signUp('asdf@asdf.com', 'asdf');
    expect(user.password).not.toEqual('asdf');
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('throws an error if user signs up with email that is in use', async () => {
    await service.signUp('asdf@asdf.com', 'asdf');
    // Promise.resolve([
    //   { id: 1, email: 'asdf@asdf.com', password: 'asdf' } as User,
    // ]);
    await expect(service.signUp('asdf@asdf.com', 'asdf')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('throws if signin is called with an unused email', async () => {
    await expect(service.signIn('asdf@asdf.com', 'asdf')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('throws if an invalid password is provided', async () => {
    await service.signUp('laskdjf@alskdfj.com', 'password');
    await expect(
      service.signIn('laskdjf@alskdfj.com', 'daseasdas'),
    ).rejects.toThrow(BadRequestException);
  });

  it('returns a user if correct password is provided', async () => {
    await service.signUp('asdf@asdf.com', 'mypassword');
    const user = await service.signIn('asdf@asdf.com', 'mypassword');
    expect(user).toBeDefined();
  });
});
