import * as config from 'config';

const userConfiguration = config.get<{ idLength: number }>('user');

export const userConfig: { idLength: number } = {
    idLength: userConfiguration.idLength,
};
