import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as config from 'config';
import { Admin } from 'src/admin/admin-admins/entity/admin.entity';
import { Course } from 'src/course/entity/course.entity';
import { Enrollment } from 'src/enrollments/entity/enrollments.entity';
import { Student } from 'src/student/entity/student.entity';
import { Logger } from 'typeorm';
const dbConfig = config.get<{
    type: any;
    host: string;
    port: number;
    database: string;
    username: string;
    password: string;
    synchronize: boolean;
    logging: boolean;
    logger: 'debug' | 'advanced-console' | 'simple-console' | 'file' | Logger;
    connectionAlive: boolean;
    migrations: string[];
    migrationsTableName: string;
    migrationsRun: boolean;
}>('db');

export const typeOrmConfig: TypeOrmModuleOptions = {
    type: dbConfig.type,
    host: process.env.DB_HOSTNAME || dbConfig.host,
    port: parseInt(process.env.DB_PORT, 10) || dbConfig.port,
    username: process.env.DB_USER || dbConfig.username,
    password: process.env.DB_PASSWORD || dbConfig.password,
    database: process.env.DB_NAME || dbConfig.database,
    entities: [
        Student,
        Admin,
        Course,
        Enrollment
    ],
    synchronize: dbConfig.synchronize,
    logging: dbConfig.logging,
    logger: dbConfig.logger,
    extra: {
        charset: 'utf8mb4_unicode_520_ci',
    },
    keepConnectionAlive: dbConfig.connectionAlive || false,
    migrations: dbConfig.migrations,
    migrationsTableName: dbConfig.migrationsTableName || 'migrations_typeorm',
    migrationsRun: dbConfig.migrationsRun || false,
};
