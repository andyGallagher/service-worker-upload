import { onUploadToS3Observable } from './index';
import { s3 } from '../aws/s3';
import { ENV } from '../util/env';

export const observableUpload = (files: File[]) => {
	files.forEach((file) => {
		const upload = s3.upload(
			{
				Key: file.name,
				Bucket: ENV.awsBucket,
				Body: file,
				ContentType: file.type || 'application/octet-stream',
			},
			(err, data) => {
				console.log(err);
				console.log(data);
			}
		);

		upload.on('httpUploadProgress', (progress) => {
			const progressPercentage = Math.floor(
				(progress.loaded / progress.total) * 100
			);

			onUploadToS3Observable.next({
				[file.name]:
					progressPercentage !== 100 ? progressPercentage : undefined,
			});
		});

		return upload;
	});
};
