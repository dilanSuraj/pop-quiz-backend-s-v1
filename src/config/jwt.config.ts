import * as config from 'config';

const jwtConfiguration = config.get<{ secret: string }>('jwt');

export const jwtConfig: { secret: string } = {
    secret: process.env.JWT_SECRET || jwtConfiguration.secret,
};
