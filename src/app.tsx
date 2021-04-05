import React, { useEffect, useRef, useState } from 'react';

import { onUploadToS3 } from './observables/index';
import { observableUpload } from './observables/observableUpload';

export type UploadsMap = { [key: string]: number | undefined };
export const App: React.FC = () => {
	const uploadRef = useRef<HTMLInputElement>(null);
	const [uploadsMap, setUploadsMap] = useState<UploadsMap>({});
	const uploadsEntries = Object.entries(uploadsMap);

	useEffect(() => {
		const subscription = onUploadToS3((upload) =>
			setUploadsMap((uploadsMap) => ({
				...uploadsMap,
				...upload,
			}))
		);
		return () => subscription.unsubscribe();
	}, []);

	const handleUpload = async () => {
		if (uploadRef.current && uploadRef.current.files) {
			const files = Array.from(uploadRef.current.files);

			setUploadsMap(
				files.reduce((acc, file) => ({ ...acc, [file.name]: 0 }), {})
			);
			observableUpload(files);
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
