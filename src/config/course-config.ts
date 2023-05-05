import * as config from 'config';

const courseConfiguration = config.get<{ courseIdLength: number }>('course');

export const courseConfig: { courseIdLength: number } = {
    courseIdLength: courseConfiguration.courseIdLength,
};
