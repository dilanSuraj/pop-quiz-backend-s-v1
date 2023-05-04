import { Entity, PrimaryColumn, Column, Unique, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Course } from 'src/course/entity/course.entity';

@Entity()
@Unique(['username'])
export class Admin {
    @ApiProperty()
    @PrimaryColumn()
    userId: string;

    @ApiProperty()
    @Column({ default: null, nullable: true })
    username: string;

    @Column({ default: null, nullable: true, select: false })
    password?: string;

    @Column({ default: null, nullable: true, select: false })
    salt?: string;

    @ApiProperty()
    @OneToMany(
        () => Course,
        course => course.createdBy,
    )
    courses: Course[];
}
