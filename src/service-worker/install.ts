export const installServiceWorker = () => {
	if ('serviceWorker' in navigator) {
		window.addEventListener('load', function () {
			navigator.serviceWorker.register('/sw.ts').then(
				(registration) => {
					// Registration was successful
					console.log(
						'ServiceWorker registration successful with scope: ',
						registration.scope
					);
				},
				(err) => {
					// registration failed :(
					console.log('ServiceWorker registration failed: ', err);
				}
			);
		});
	}
};
