import { S3 } from 'aws-sdk';

import { ENV } from '../util/env';

export const s3 = new S3({
	region: ENV.awsRegion,
	accessKeyId: ENV.awsKey,
	secretAccessKey: ENV.awsSecretKey,
	httpOptions: {
		timeout: 600000,
	},
});
