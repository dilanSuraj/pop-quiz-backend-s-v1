import * as randomize from 'randomatic';
import { courseConfig } from 'src/config/course-config';
import { enrollmentConfig } from 'src/config/enrollment-config';
import { userConfig } from 'src/config/user-config';

export const generateStudentId = (): string => randomize('0', userConfig.idLength);

export const generateCourseId = (): string => 'C' + randomize('0', courseConfig.courseIdLength);

export const generateEnrollmentId = (): string => 'E' + randomize('0', enrollmentConfig.idLength);

export const generateAdminId = (): string => 'AD' + randomize('0', userConfig.idLength);

export const generateRandomNumberString = (length: number): string => randomize('0', length);

export const generateRandomLetters = (length: number): string => randomize('a', length);
