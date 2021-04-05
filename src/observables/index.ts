import { Subject, Subscription } from 'rxjs';

import { UploadsMap } from '../app';

export const onUploadToS3Observable = new Subject<UploadsMap>();

export const onUploadToS3 = (
	subscribe: (upload: UploadsMap) => void
): Subscription => onUploadToS3Observable.subscribe(subscribe);
