import { of } from "rxjs";
import { LoadingService } from "src/app/services/loading.service";

export function getLoadingServiceMock() {
    return jasmine.createSpyObj<LoadingService>(
        'LoadingService',
        {
            getLoadingObs: of(true)
        }
    )
}