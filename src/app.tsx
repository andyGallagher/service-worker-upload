import React, { useRef, useState } from 'react';
import { S3 } from 'aws-sdk';
import { ENV } from './util/env';

const s3 = new S3({
	region: ENV.awsRegion,
	accessKeyId: ENV.awsKey,
	secretAccessKey: ENV.awsSecretKey,
	httpOptions: {
		timeout: 600000,
	},
});

export const App: React.FC = () => {
	const uploadRef = useRef<HTMLInputElement>(null);
	const [uploadsMap, setUploadsMap] = useState<{ [key: string]: number }>({});
	const uploadsEntries = Object.entries(uploadsMap);

	const handleUpload = async () => {
		if (uploadRef.current && uploadRef.current.files) {
			const files = Array.from(uploadRef.current.files);

			setUploadsMap(
				files.reduce((acc, file) => ({ ...acc, [file.name]: 0 }), {})
			);

			try {
				await Promise.all(
					files.map(
						async (file) =>
							new Promise<S3.ManagedUpload.SendData>(
								(res, rej) => {
									const upload = s3.upload(
										{
											Key: file.name,
											Bucket: ENV.awsBucket,
											Body: file,
											ContentType:
												file.type ||
												'application/octet-stream',
										},
										(err, data) => {
											if (err) rej(err);
											res(data);
										}
									);

									upload.on(
										'httpUploadProgress',
										(progress) => {
											setUploadsMap((uploadsMap) => ({
												...uploadsMap,
												[file.name]: Math.floor(
													(progress.loaded /
														progress.total) *
														100
												),
											}));
										}
									);
								}
							)
					)
				);
			} catch (e) {
				console.warn('ffff');
			} finally {
				setUploadsMap({});
			}
		}
	};

	return (
		<>
			<h1>Uploads</h1>
			<input ref={uploadRef} type="file" multiple />
			<div>
				<button onClick={handleUpload}>Get it</button>
			</div>

			{Boolean(uploadsEntries.length) && (
				<>
					<h2>Progress</h2>
					<div>
						{uploadsEntries.map(([fileName, progress]) => (
							<div key={fileName}>
								<h3>{fileName}</h3>
								<span>{progress}</span>
							</div>
						))}
					</div>
				</>
			)}
		</>
	);
};
