import { Entity, PrimaryColumn, Column, CreateDateColumn, Index, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { StudentStatus } from './student.interface';
import { Enrollment } from 'src/enrollments/entity/enrollments.entity';

@Entity()
@Index(['studentId'])
export class Student {
    @ApiProperty()
    @PrimaryColumn()
    studentId: string;

    @Column()
    name: string;

    @ApiProperty()
    @Column({ default: null, nullable: true })
    email?: string;

    @Column({ default: null, nullable: true })
    password?: string;

    @Column({ default: null, nullable: true })
    salt?: string;

    @ApiProperty()
    @CreateDateColumn()
    joinedDate?: Date;

    @ApiProperty({ enum: StudentStatus, enumName: 'StudentStatus' })
    @Column({ default: StudentStatus.ACTIVATED })
    status?: StudentStatus;

    @ApiProperty()
    @OneToMany(
        () => Enrollment,
        enrollment => enrollment.student,
    )
    enrollments: Enrollment[];
}
