import * as config from 'config';

const userConfiguration = config.get<{ idLength: number; defaultUser: string }>('user');

export const userConfig: { idLength: number; defaultUser: string } = {
    idLength: userConfiguration.idLength,
    defaultUser: userConfiguration.defaultUser,
};
