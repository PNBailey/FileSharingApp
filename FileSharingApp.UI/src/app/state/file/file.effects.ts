import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { FilesActions, FilesApiActions } from "./file.actions";
import { catchError, debounceTime, finalize, forkJoin, map, of, switchMap, tap } from "rxjs";
import { FileService } from "src/app/services/file.service";
import { MessageHandlingService } from "src/app/services/message-handling.service";
import { AppFile } from "src/app/models/app-file";
import { LoadingObsName, LoadingService } from "src/app/services/loading.service";


@Injectable()
export class FileEffects {

    uploadFiles$ = createEffect(() =>
        this.actions$.pipe(
            ofType(FilesActions.uploadFiles),
            switchMap((action) => {
                const files = action.files;
                const filesObservableArray = files.map(file => {
                    return this.fileService.uploadFile(file, action.folderId);
                });
                return forkJoin(filesObservableArray).pipe(
                    map((files) => {
                        return FilesApiActions.uploadFilesSuccessful({ files: files })
                    }),
                    catchError(() => {
                        return of(FilesApiActions.uploadFilesUnsuccessful())
                    })
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

    uploadFilesUnsuccessful$ = createEffect(() =>
        this.actions$.pipe(
            ofType(FilesApiActions.uploadFilesUnsuccessful),
            tap(() => {
                this.messageHandlingService.onDisplayNewMessage({
                    message: "An error occured during the upload process. Please try again later"
                });
            }),
        ), { dispatch: false }
    );

    getAllFiles$ = createEffect(() =>
        this.actions$.pipe(
            ofType(FilesActions.getAllFiles),
            tap(() => this.loadingService.toggleLoadingObs(LoadingObsName.LOADING_FILES)),
            // debounceTime(1000),
            switchMap(() => this.fileService.getAllFiles()),
            map((files: AppFile[]) => FilesApiActions.getFilesSuccessful({ files: files })),
            catchError(() => of(FilesApiActions.getFilesUnsuccessful()))
        )
    );

    getFilesUnsuccessful$ = createEffect(() =>
        this.actions$.pipe(
            ofType(FilesApiActions.getFilesUnsuccessful),
            tap(() => {
                this.messageHandlingService.onDisplayNewMessage({
                    message: "Unable to get files. Please try again later"
                });
            }),
        ), { dispatch: false }
    );

    getFolderFiles$ = createEffect(() =>
        this.actions$.pipe(
            ofType(FilesActions.getFolderFiles),
            tap(() => this.loadingService.toggleLoadingObs(LoadingObsName.LOADING_FILES)),
            // debounceTime(2000),
            switchMap((action) => this.fileService.getFolderFiles(action.folderId)),
            map((files: AppFile[]) => FilesApiActions.getFilesSuccessful({ files: files })),
            catchError(() => of(FilesApiActions.getFilesUnsuccessful())),
        )
    );

    getFilesSuccessful$ = createEffect(() =>
        this.actions$.pipe(
            ofType(FilesApiActions.getFilesSuccessful),
            tap(() => this.loadingService.toggleLoadingObs(LoadingObsName.LOADING_FILES))
        ), { dispatch: false }
    );

    constructor(
        private actions$: Actions,
        private fileService: FileService,
        private messageHandlingService: MessageHandlingService,
        private loadingService: LoadingService
    ) { }
}
