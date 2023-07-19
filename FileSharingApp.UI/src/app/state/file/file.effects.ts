import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { MyFilesActions, MyFilesApiActions } from "./file.actions";
import { map, switchMap, tap } from "rxjs";
import { FileService } from "src/app/services/file.service";
import { MessageHandlingService } from "src/app/services/message-handling.service";


@Injectable()
export class FileEffects {

    uploadFiles$ = createEffect(() => 
        this.actions$.pipe(
            ofType(MyFilesActions.uploadFile),
            switchMap(action => this.fileService.uploadFile(action.file)),
            map((file) => MyFilesApiActions.uploadFileSuccessful({ file: file }))
        )
    );

    uploadFileSuccessful$ = createEffect(() => 
        this.actions$.pipe(
            ofType(MyFilesApiActions.uploadFileSuccessful),
            tap((file) => {
                this.messageHandlingService.onDisplayNewMessage({
                    message: "File successfully uploaded"
                });
                console.log(file);
            }),
        ), { dispatch: false }
    );

    constructor(
        private actions$: Actions,
        private fileService: FileService,
        private messageHandlingService: MessageHandlingService
    ) { }
}
