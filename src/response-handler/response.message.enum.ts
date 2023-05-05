export enum ResponseMessageEnums {
    INVALID_COURSE = 'Course does not exist',
    INVALID_ADMIN = 'Admin does not exist',
    INVALID_ENROLLMENT = 'Enrollment does not exist',
    USER_ALREADY_EXISTS = 'User already exists',
    ADMIN_ALREADY_EXISTS = 'Admin already exists',
    ENROLLMENT_ALREADY_EXISTS = 'Enrollment already exists',
    NOT_YET_ENROLLED = 'Student has not yet enrolled',
    USER_DEACTIVATED = 'Account temporarily deactivated, Please contact support',
    MAX_ENROLLMENT_COUNT_CANNOT_BE_REDUCED = 'Cannot reduce the current maximum enrollment count when there are still registered enrollments exist',
    PASSWORD_MISMATCHING = 'Current password is incorrect',
    ENROLLMENTS_MAX_COUNT_REACHED = 'Enrollment count has reached maximum, cannot accept anymore enrollments',
}
