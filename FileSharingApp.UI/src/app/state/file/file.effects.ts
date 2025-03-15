import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { FilesActions, FilesApiActions } from "./file.actions";
import { finalize, forkJoin, map, mergeMap, switchMap, tap, withLatestFrom } from "rxjs";
import { FileService } from "src/app/services/file.service";
import { MessageHandlingService } from "src/app/services/message-handling.service";
import { AppFile } from "src/app/models/app-file";
import { FileType } from "src/app/models/file-type";
import { PaginatedResponse } from "src/app/models/paginated-response";
import { Store } from "@ngrx/store";
import { LoadingBoolName } from "../loading/loading.reducer";
import { LoadingActions } from "../loading/loading.actions";
import { getFileSearchParams } from "./file.selector";

@Injectable()
export class FileEffects {

    uploadFiles$ = createEffect(() =>
        this.actions$.pipe(
            ofType(FilesActions.uploadFiles),
            switchMap((action) => {
                this.store.dispatch(LoadingActions.toggleLoading({ loadingBoolName: LoadingBoolName.UPLOADING_FILES }));
                const uploadRequests = action.files.map(file => this.fileService.uploadFile(file));
                return forkJoin(uploadRequests).pipe(
                    map((uploadedFiles: AppFile[]) =>
                        FilesApiActions.uploadFilesSuccessful({ uploadedFiles: uploadedFiles })
                    ),
                    finalize(() =>
                        this.store.dispatch(LoadingActions.toggleLoading({ loadingBoolName: LoadingBoolName.UPLOADING_FILES }))
                    )
                )
            })
        )
    );

    uploadFilesSuccessful$ = createEffect(() =>
        this.actions$.pipe(
            ofType(FilesApiActions.uploadFilesSuccessful),
            tap(() => {
                this.messageHandlingService.onDisplayNewMessage({
                    message: "Files successfully uploaded"
                });
            }),
        ), { dispatch: false }
    );

    getFiles$ = createEffect(() =>
        this.actions$.pipe(
            ofType(FilesActions.searchFiles),
            switchMap((action) => {
                this.store.dispatch(LoadingActions.toggleLoading({ loadingBoolName: LoadingBoolName.LOADING_FILES }))
                return this.fileService.getFiles(action.searchParams).pipe(
                    finalize(() => this.store.dispatch(LoadingActions.toggleLoading({ loadingBoolName: LoadingBoolName.LOADING_FILES })))
                )
            }),
            map((paginatedResponse: PaginatedResponse<AppFile>) => FilesApiActions.getFilesSuccessful({ paginatedResponse: paginatedResponse }))
        )
    );

    getFileTypes$ = createEffect(() =>
        this.actions$.pipe(
            ofType(FilesActions.getFileTypes),
            switchMap(() => this.fileService.getFileTypes()),
            map((fileTypes: FileType[]) => FilesApiActions.getFileTypesSuccessful({ fileTypes: fileTypes }))
        )
    );

    deleteFile$ = createEffect(() =>
        this.actions$.pipe(
            ofType(FilesActions.deleteFile),
            mergeMap((action) => {
                this.store.dispatch(LoadingActions.toggleLoading({ loadingBoolName: action.file.name }))
                return this.fileService.deleteFile(action.file);
            }),
            tap((file: AppFile) => this.store.dispatch(LoadingActions.toggleLoading({ loadingBoolName: file.name }))),
            map((file: AppFile) => FilesApiActions.deleteFileSuccessful({ file: file }))
        )
    );

    deleteFileSuccessful$ = createEffect(() =>
        this.actions$.pipe(
            ofType(FilesApiActions.deleteFileSuccessful),
            tap((action) => {
                this.messageHandlingService.onDisplayNewMessage({
                    message: "File deleted"
                });
                this.store.dispatch(LoadingActions.toggleLoading({ loadingBoolName: action.file.name }))
            }),
        ), { dispatch: false }
    );

    updateFile$ = createEffect(() =>
        this.actions$.pipe(
            ofType(FilesActions.updateFile),
            switchMap((action) => {
                this.store.dispatch(LoadingActions.toggleLoading({ loadingBoolName: LoadingBoolName.UPDATING_FILE }))
                return this.fileService.updateFile(action.file).pipe(
                    finalize(() => this.store.dispatch(LoadingActions.toggleLoading({ loadingBoolName: LoadingBoolName.UPDATING_FILE })))
                )
            }),
            map((file: AppFile) => FilesApiActions.updateFileSuccessful({ file: file }))
        )
    );

    updateFileSuccessful$ = createEffect(() =>
        this.actions$.pipe(
            ofType(FilesApiActions.updateFileSuccessful),
            withLatestFrom(this.store.select(getFileSearchParams)),
            tap(() => {
                this.messageHandlingService.onDisplayNewMessage({
                    message: "File updated"
                });
            }),
            map(([action, existingSearchParams]) => FilesActions.searchFiles({ searchParams: existingSearchParams }))
        )
    );

    downloadFile$ = createEffect(() =>
        this.actions$.pipe(
            ofType(FilesActions.downloadFile),
            switchMap((action) =>
                this.fileService.downloadFile(action.fileName).pipe(
                    tap((blob) => {
                        const a = document.createElement('a');
                        const objectUrl = URL.createObjectURL(blob);
                        a.href = objectUrl;
                        a.download = action.fileName;
                        a.style.display = 'none';
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        URL.revokeObjectURL(objectUrl);
                    })
                )
            )
        ), { dispatch: false }
    );

    constructor(
        private actions$: Actions,
        private fileService: FileService,
        private messageHandlingService: MessageHandlingService,
        private store: Store,
    ) { }
}
