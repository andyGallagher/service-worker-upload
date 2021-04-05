/// <reference no-default-lib="true"/>
/// <reference lib="es2015" />
/// <reference lib="webworker" />

import { observableUpload } from '../src/observables/observableUpload';
import { ENV } from '../src/util/env';

/* self is WorkerGlobalScope & typeof globalThis */
self.addEventListener('install', async () => {
	console.log('nice');
});

self.addEventListener('activate', () => {
	console.log('V1 now ready to handle fetches!');
});

self.addEventListener('fetch', async (event) => {
	const fetchEvent = event as FetchEvent;

	if (fetchEvent.request.url.includes(ENV.awsBucket)) {
		fetchEvent.respondWith(
			(async () => {
				console.log(fetchEvent.request);
				console.log(fetchEvent.request.body);

				// observableUpload();

				return new Response();
			})()
		);
	}
});
