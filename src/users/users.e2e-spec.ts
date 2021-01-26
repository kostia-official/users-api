import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import * as faker from 'faker';
import { AppModule } from '../app.module';
import { UsersService } from './users.service';
import { User } from './users.entity';

describe('Users (e2e)', () => {
  let usersService: UsersService;
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    usersService = moduleFixture.get<UsersService>(UsersService);

    await app.init();
  });

  describe('POST /users', () => {
    const user: Partial<User> = {
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      email: faker.internet.email(),
      password: faker.random.uuid(),
    };

    it('should create a user', () => {
      const { password, ...userWithoutPassword } = user;

      return request(app.getHttpServer())
        .post('/users')
        .send(user)
        .expect(201)
        .expect((req) => {
          expect(req.body.accessToken).toBeTruthy();
          expect(req.body.user).toMatchObject(userWithoutPassword);
        });
    });
  });

  describe('POST /login', () => {
    describe('when email password are correct', () => {
      const user: Partial<User> = {
        id: faker.random.uuid(),
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        email: faker.internet.email(),
        password: faker.random.uuid(),
      };

      beforeAll(() => {
        return request(app.getHttpServer()).post('/users').send(user);
      });

      it('should return a user', () => {
        const { password, ...userWithoutPassword } = user;

        return request(app.getHttpServer())
          .post('/users/login')
          .send({ email: user.email, password: user.password })
          .expect(200)
          .expect((req) => {
            expect(req.body.accessToken).toBeTruthy();
            expect(req.body.user).toMatchObject(userWithoutPassword);
          });
      });
    });

    describe('when email is incorrect', () => {
      const user: Partial<User> = {
        id: faker.random.uuid(),
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        email: faker.internet.email(),
        password: faker.random.uuid(),
      };

      beforeAll(() => {
        return request(app.getHttpServer()).post('/users').send(user);
      });

      it('should return a user', () => {
        return request(app.getHttpServer())
          .post('/users/login')
          .send({ email: 'wrong', password: user.password })
          .expect(401);
      });
    });

    describe('when password is incorrect', () => {
      const user: Partial<User> = {
        id: faker.random.uuid(),
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        email: faker.internet.email(),
        password: faker.random.uuid(),
      };

      beforeAll(() => {
        return request(app.getHttpServer()).post('/users').send(user);
      });

      it('should return a user', () => {
        return request(app.getHttpServer())
          .post('/users/login')
          .send({ email: user.email, password: '123' })
          .expect(401);
      });
    });
  });

  describe('Authorization', () => {
    describe('when token is correct', () => {
      const user: Partial<User> = {
        id: faker.random.uuid(),
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        email: faker.internet.email(),
        password: faker.random.uuid(),
      };

      let accessToken;
      beforeAll(async () => {
        const result = await request(app.getHttpServer())
          .post('/users')
          .send(user);

        accessToken = result.body.accessToken;
      });

      it('should return a user', () => {
        const { password, ...userWithoutPassword } = user;

        return request(app.getHttpServer())
          .get(`/users/${user.id}`)
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(200)
          .expect((req) => {
            expect(req.body).toMatchObject(userWithoutPassword);
          });
      });
    });

    describe('when token is incorrect', () => {
      const user: Partial<User> = {
        id: faker.random.uuid(),
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        email: faker.internet.email(),
        password: faker.random.uuid(),
      };

      let accessToken;
      beforeAll(async () => {
        const result = await request(app.getHttpServer())
          .post('/users')
          .send(user);

        accessToken = result.body.accessToken;
      });

      it('should return a user', () => {
        return request(app.getHttpServer())
          .get(`/users/${user.id}`)
          .set('Authorization', `123`)
          .expect(401);
      });
    });
  });
});
