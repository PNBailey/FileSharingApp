import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { FilesActions, FilesApiActions } from "./file.actions";
import { catchError, forkJoin, map, of, switchMap, tap } from "rxjs";
import { FileService } from "src/app/services/file.service";
import { MessageHandlingService } from "src/app/services/message-handling.service";
import { AppFile } from "src/app/models/app-file";


@Injectable()
export class FileEffects {

    uploadFiles$ = createEffect(() => 
        this.actions$.pipe(
            ofType(FilesActions.uploadFiles),
            switchMap((action) => {
                const files = action.files;
                const filesObservableArray = files.map(file => {
                    return this.fileService.uploadFile(file);
                });
                return forkJoin(filesObservableArray).pipe(
                    map((files) => {
                        return FilesApiActions.uploadFilesSuccessful({files: files})
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
            switchMap(() => this.fileService.getAllFiles()),
            map((files: AppFile[]) => FilesApiActions.getFilesSuccessful({files: files}))
        )
    )

    constructor(
        private actions$: Actions,
        private fileService: FileService,
        private messageHandlingService: MessageHandlingService
    ) { }
}
