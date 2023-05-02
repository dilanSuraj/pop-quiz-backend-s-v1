import * as config from 'config';

const awsConfiguration = config.get<{
    s3Bucket: string;
    s3BucketRegion: string;
    accessKeyId: string;
    secretAccessKey: string;
}>('aws');

export const awsConfig: { s3Bucket: string; s3BucketRegion: string; accessKeyId: string; secretAccessKey: string } = {
    s3Bucket: process.env.S3_BUCKET || awsConfiguration.s3Bucket,
    s3BucketRegion: process.env.REGION || awsConfiguration.s3BucketRegion,
    accessKeyId: process.env.ACCESS_KEY_ID || awsConfiguration.accessKeyId,
    secretAccessKey: process.env.SECRET_ACCESS_KEY || awsConfiguration.secretAccessKey,
};
