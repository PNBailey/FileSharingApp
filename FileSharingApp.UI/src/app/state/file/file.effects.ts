import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { FilesActions, FilesApiActions } from "./file.actions";
import { finalize, forkJoin, map, mergeMap, switchMap, tap } from "rxjs";
import { FileService } from "src/app/services/file.service";
import { MessageHandlingService } from "src/app/services/message-handling.service";
import { AppFile } from "src/app/models/app-file";
import { LoadingObsName, LoadingService } from "src/app/services/loading.service";
import { FileType } from "src/app/models/file-type";
import { PaginatedResponse } from "src/app/models/paginated-response";

@Injectable()
export class FileEffects {

    uploadFiles$ = createEffect(() =>
        this.actions$.pipe(
            ofType(FilesActions.uploadFiles),
            tap(() => this.loadingService.toggleLoadingObs(LoadingObsName.UPLOADING_FILES)),
            switchMap((action) => {
                const filesObservableArray = action.files.map(file => this.fileService.uploadFile(file));
                return forkJoin(filesObservableArray).pipe(
                    map((uploadedFiles: AppFile[]) => FilesApiActions.uploadFilesSuccessful({ uploadedFiles: uploadedFiles })),
                    finalize(() => this.loadingService.toggleLoadingObs(LoadingObsName.UPLOADING_FILES))
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
            tap(() => this.loadingService.toggleLoadingObs(LoadingObsName.LOADING_FILES)),
            switchMap((action) => this.fileService.getFiles(action.searchParams).pipe(
                finalize(() => this.loadingService.toggleLoadingObs(LoadingObsName.LOADING_FILES))
            )),
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
            tap((action) => this.loadingService.toggleLoadingObs(action.file.name)),
            mergeMap((action) => this.fileService.deleteFile(action.file)),
            tap((file: AppFile) => this.loadingService.toggleLoadingObs(file.name)),
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
                this.loadingService.toggleLoadingObs(action.file.name)
            }),
        ), { dispatch: false }
    );

    updateFile$ = createEffect(() =>
        this.actions$.pipe(
            ofType(FilesActions.updateFile),
            tap(() => this.loadingService.toggleLoadingObs(LoadingObsName.UPDATING_FILE)),
            switchMap((action) => this.fileService.updateFile(action.file).pipe(
                finalize(() => this.loadingService.toggleLoadingObs(LoadingObsName.UPDATING_FILE))
            )),
            map((file: AppFile) => FilesApiActions.updateFileSuccessful({ file: file }))
        )
    );

    updateFileSuccessful$ = createEffect(() =>
        this.actions$.pipe(
            ofType(FilesApiActions.updateFileSuccessful),
            tap(() => {
                this.messageHandlingService.onDisplayNewMessage({
                    message: "File updated"
                });
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
