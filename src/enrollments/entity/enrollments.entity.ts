import { ApiProperty } from '@nestjs/swagger';
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import { EnrollmentStatus } from '../enrollment-status.enum';
import { Student } from 'src/student/entity/student.entity';
import { Course } from 'src/course/entity/course.entity';

@Entity()
export class Enrollment {
    @ApiProperty()
    @PrimaryColumn()
    enrollmentId: string;

    @ApiProperty({ enum: EnrollmentStatus, enumName: 'EnrollmentStatus' })
    @Column({ default: EnrollmentStatus.REGISTERED })
    enrollmentStatus: EnrollmentStatus;

    @ApiProperty()
    @Column()
    courseKey: string;

    @ApiProperty({ type: () => Student })
    @ManyToOne(() => Student, (student) => student.enrollments)
    student: Student;

    @ApiProperty({ type: () => Course })
    @ManyToOne(() => Course, (course) => course.enrollments)
    course: Course;

    @ApiProperty()
    @CreateDateColumn()
    createdDate?: Date;

    @ApiProperty()
    @UpdateDateColumn()
    updatedDate?: Date;
}
