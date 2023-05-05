import * as config from 'config';

const enrollmentConfiguration = config.get<{ idLength: number }>('enrollment');

export const enrollmentConfig: { idLength: number } = {
    idLength: enrollmentConfiguration.idLength,
};
