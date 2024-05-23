import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { FilesActions, FilesApiActions } from "./file.actions";
import { catchError, forkJoin, map, mergeMap, of, switchMap, tap } from "rxjs";
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

    deleteFile$ = createEffect(() =>
        this.actions$.pipe(
            ofType(FilesActions.deleteFile),
            tap((action) => this.loadingService.toggleLoadingObs(action.file.name)),
            mergeMap((action) => this.fileService.deleteFile(action.file)),
            map((file: AppFile) => FilesApiActions.deleteFileSuccessful({ file: file })),
            catchError((action) => of(FilesApiActions.deleteFileUnsuccessful(action))),
        )
    );

    deleteFileSuccessful$ = createEffect(() =>
        this.actions$.pipe(
            ofType(FilesApiActions.deleteFileSuccessful),
            tap((action) => {
                this.messageHandlingService.onDisplayNewMessage({
                    message: "File deleted"
                });
                this.loadingService.toggleLoadingObs(action.file.name)
            }),
        ), { dispatch: false }
    );

    deleteFileUnsuccessful$ = createEffect(() =>
        this.actions$.pipe(
            ofType(FilesApiActions.deleteFileUnsuccessful),
            tap((action) => {
                this.messageHandlingService.onDisplayNewMessage({
                    message: "Unable to delete file. Please try again later"
                });
                this.loadingService.toggleLoadingObs(action.file.name)

            }),
        ), { dispatch: false }
    );

    updateFile$ = createEffect(() =>
        this.actions$.pipe(
            ofType(FilesActions.updateFile),
            tap(() => this.loadingService.toggleLoadingObs(LoadingObsName.UPDATING_FILE)),
            switchMap((action) => this.fileService.updateFile(action.file)),
            map((file: AppFile) => FilesApiActions.updateFileSuccessful({ file: file })),
            catchError(() => of(FilesApiActions.updateFileUnsuccessful())),
        )
    );

    updateFileSuccessful$ = createEffect(() =>
        this.actions$.pipe(
            ofType(FilesApiActions.updateFileSuccessful),
            tap(() => {
                this.messageHandlingService.onDisplayNewMessage({
                    message: "File updated"
                });
                this.loadingService.toggleLoadingObs(LoadingObsName.UPDATING_FILE)
            }),
        ), { dispatch: false }
    );

    updateFileUnsuccessful$ = createEffect(() =>
        this.actions$.pipe(
            ofType(FilesApiActions.updateFileUnsuccessful),
            tap(() => {
                this.messageHandlingService.onDisplayNewMessage({
                    message: "Unable to update file. Please try again later"
                });
                this.loadingService.toggleLoadingObs(LoadingObsName.UPDATING_FILE)
            }),
        ), { dispatch: false }
    );

    constructor(
        private actions$: Actions,
        private fileService: FileService,
        private messageHandlingService: MessageHandlingService,
        private loadingService: LoadingService
    ) { }
}
