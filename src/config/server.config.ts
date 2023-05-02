import * as config from 'config';

const serverConfiguration = config.get<{ port: number; hostedDomain: string }>('server');

export const serverConfig: { port: number; hostedDomain: string } = {
    port: parseInt(process.env.PORT, 10) || serverConfiguration.port,
    hostedDomain: process.env.HOSTED_DOMAIN || serverConfiguration.hostedDomain,
};
