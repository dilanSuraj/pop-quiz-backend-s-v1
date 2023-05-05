import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn, PrimaryColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Admin } from 'src/admin/admin-admins/entity/admin.entity';
import { Enrollment } from 'src/enrollments/entity/enrollments.entity';

@Entity()
export class Course {
    @ApiProperty()
    @PrimaryColumn()
    courseId: string;

    @ApiProperty()
    @Column()
    courseName: string;

    @ApiProperty({ type: () => Admin })
    @ManyToOne(
        () => Admin,
        admin => admin.courses,
    )
    manageBy: Admin;

    @ApiProperty()
    @Column()
    key: string;

    @ApiProperty()
    @OneToMany(
        () => Enrollment,
        enrollment => enrollment.course,
    )
    enrollments: Enrollment[];

    @ApiProperty()
    @Column({ type: 'int', default: 0 })
    maxEnrollmentCapacity: number;

    @ApiProperty()
    @CreateDateColumn()
    createdDate?: Date;

    @ApiProperty()
    @UpdateDateColumn()
    updatedDate?: Date;

}
