import { ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { MongoDatabaseModule } from '@repo/nest-mongo-database';
import { generateJwt } from '@repo/nest-test-utils';
import * as request from 'supertest';

import { AuthModule } from '../src/model/auth/auth.module';
import { OrganizationModule } from '../src/model/organization/organization.module';
import { OrganizationMemberStatusEnum } from '../src/model/organization-member/organization-member.interface';
import { RoleEnum } from '../src/model/organization-role/organization-role.interface';
import { AuthTestModule } from './interface/auth.interface';
import { TestModule } from './utils/test.module';
import { TestService } from './utils/test.service';

describe('Auth Controller', () => {
  let testModule: AuthTestModule;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: '.env.test',
        }),
        MongoDatabaseModule,
        AuthModule,
        OrganizationModule,
        TestModule,
      ],
    }).compile();

    const app = moduleRef.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        forbidNonWhitelisted: true,
        forbidUnknownValues: true,
      }),
    );

    await app.init();

    testModule = {
      app,
      testService: moduleRef.get<TestService>(TestService),
    };
  });

  afterEach(async () => {
    await testModule.testService.clearDatabase();
    await testModule.app.close();
  });

  describe('/auth endpoint', () => {
    describe('POST /auth/login', () => {
      it('should return 401 if email is not provided', async () => {
        const { status } = await request(testModule.app.getHttpServer())
          .post('/auth/login')
          .send({
            password: 'password',
          });

        expect(status).toBe(401);
      });

      it('should return 401 if password is not provided', async () => {
        const { status } = await request(testModule.app.getHttpServer())
          .post('/auth/login')
          .send({
            email: 'email',
          });

        expect(status).toBe(401);
      });

      it('should return 200 if email and password are provided', async () => {
        const user = await testModule.testService.createUser({
          name: 'test',
          email: 'email@email.com',
          password: 'P@ssword123!',
        });

        await testModule.testService.setupOrganization(
          {
            name: 'test',
          },
          user,
        );

        const { status, body } = await request(testModule.app.getHttpServer())
          .post('/auth/login')
          .send({
            email: 'email@email.com',
            password: 'P@ssword123!',
          });

        expect(status).toBe(201);
        expect(body.access_token).toBeDefined();
      });
    });

    describe.skip('POST /auth/register', () => {
      it('should return 400 if email is not provided', async () => {
        const { status, body } = await request(testModule.app.getHttpServer())
          .post('/auth/register')
          .send({
            password: 'P@ssword123!',
            name: 'test',
          });

        expect(status).toBe(400);
        expect(body.message).toEqual([
          'email must be an email',
          'email should not be empty',
        ]);
      });

      it('should return 400 if email is not valid', async () => {
        const { status, body } = await request(testModule.app.getHttpServer())
          .post('/auth/register')
          .send({
            email: 'email',
            password: 'P@ssword123!',
            name: 'test',
          });

        expect(status).toBe(400);
        expect(body.message).toEqual(['email must be an email']);
      });

      it('should return 400 if password is not provided', async () => {
        const { status, body } = await request(testModule.app.getHttpServer())
          .post('/auth/register')
          .send({
            email: 'email@email.com',
            name: 'test',
          });

        expect(status).toBe(400);
        expect(body.message).toEqual([
          'password is not strong enough',
          'password must be a string',
          'password should not be empty',
        ]);
      });

      it('should return 400 if password is not strong', async () => {
        const { status, body } = await request(testModule.app.getHttpServer())
          .post('/auth/register')
          .send({
            email: 'email@email.com',
            name: 'test',
            password: 'test',
          });

        expect(status).toBe(400);
        expect(body.message).toEqual(['password is not strong enough']);
      });

      it('should return 400 if name is not provided', async () => {
        const { status, body } = await request(testModule.app.getHttpServer())
          .post('/auth/register')
          .send({
            email: 'email@email.com',
            password: 'P@ssword123!',
          });

        expect(status).toBe(400);
        expect(body.message).toEqual([
          'name must be a string',
          'name should not be empty',
        ]);
      });

      it('should return 400 if email is duplicate', async () => {
        await testModule.testService.createUser({
          email: 'email@email.com',
          password: 'P@ssword123!',
          name: 'test',
        });

        const { status, body } = await request(testModule.app.getHttpServer())
          .post('/auth/register')
          .send({
            email: 'email@email.com',
            password: 'P@ssword123!',
            name: 'test',
          });

        expect(status).toBe(400);
        expect(body.message).toEqual('User already exists');
      });

      it('should return 201 if email and password are provided', async () => {
        const { status, body } = await request(testModule.app.getHttpServer())
          .post('/auth/register')
          .send({
            email: 'email@test.com',
            password: 'P@ssword123!',
            name: 'test',
          });

        expect(status).toBe(201);
        expect(body.access_token).toBeDefined();
      });
    });
  });
});

describe('Organization Controller', () => {
  let testModule: AuthTestModule;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: '.env.test',
        }),
        MongoDatabaseModule,
        OrganizationModule,
        TestModule,
      ],
    }).compile();

    const app = moduleRef.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        forbidNonWhitelisted: true,
        forbidUnknownValues: true,
      }),
    );

    await app.init();

    testModule = {
      app,
      testService: moduleRef.get<TestService>(TestService),
    };
  });

  afterEach(async () => {
    await testModule.testService.clearDatabase();
    await testModule.app.close();
  });

  describe('/organization endpoint', () => {
    describe.skip('POST /', () => {
      it('should return 401 if no token is provided', async () => {
        const { status } = await request(testModule.app.getHttpServer()).post(
          '/organization',
        );

        expect(status).toBe(401);
      });

      it('should return 400 if organization name is not provided', async () => {
        const user = await testModule.testService.createUser({
          email: 'test@email.com',
          password: 'P@ssword123!',
          name: 'test',
        });

        const token = generateJwt({
          email: user.email,
          sub: user._id,
        });

        const { status, body } = await request(testModule.app.getHttpServer())
          .post('/organization')
          .set('Authorization', `Bearer ${token}`);

        expect(status).toBe(400);
        expect(body.message).toEqual([
          'name must be a string',
          'name should not be empty',
        ]);
      });

      it('should return 201 if organization name is provided', async () => {
        const user = await testModule.testService.createUser({
          email: 'email@email.com',
          password: 'P@ssword123!',
          name: 'test',
        });

        const token = generateJwt({
          email: user.email,
          sub: user._id,
        });

        const { status, body } = await request(testModule.app.getHttpServer())
          .post('/organization')
          .set('Authorization', `Bearer ${token}`)
          .send({
            name: 'test',
          });

        const organizationMember =
          await testModule.testService.getOrganizationMemberByUser(user);
        const organization =
          await testModule.testService.getOrganizationByMember(
            organizationMember,
          );
        const organizationRole =
          await testModule.testService.getOrganizationRoleByMember(
            organizationMember,
          );

        expect(status).toBe(201);
        expect(body.access_token).toBeDefined();

        expect(organization).toBeDefined();
        expect(organization.name).toEqual('test');

        expect(organizationMember).toBeDefined();
        expect(organizationMember.status).toEqual(
          OrganizationMemberStatusEnum.ACCEPTED,
        );
        expect(organizationMember.user).toEqual(user._id);

        expect(organizationRole).toBeDefined();
        expect(organizationRole.role).toEqual(RoleEnum.OWNER);
      });
    });
  });
});
