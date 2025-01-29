import { createActionGroup, props } from "@ngrx/store";
import { LoadingBoolName } from "./loading.reducer";

export const LoadingActions = createActionGroup({
    source: 'API Calls',
    events: {
        'Toggle Loading': props<{ loadingBoolName: LoadingBoolName | string }>()
    }
});