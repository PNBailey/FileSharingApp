import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { FolderActions, FolderApiActions } from "./folder.actions";
import { FolderService } from "src/app/services/folder.service";
import { catchError, map, of, switchMap, tap } from "rxjs";
import { MessageHandlingService } from "src/app/services/message-handling.service";
import { Folder } from "src/app/models/folder";

@Injectable()
export class FolderEffects {

    getAllFolders$ = createEffect(() =>
        this.actions$.pipe(
            ofType(FolderActions.getAllFolders),
            switchMap(() => this.folderService.getFoldersList()),
            map((folders: Folder[]) => FolderApiActions.getAllFoldersSuccessful({ folders: folders })),
            catchError(() => of(FolderApiActions.getAllFoldersUnsuccessful()))
        )
    );

    getAllFoldersUnsuccessful$ = createEffect(() =>
        this.actions$.pipe(
            ofType(FolderApiActions.getAllFoldersUnsuccessful),
            tap(() => {
                this.messageHandlingService.onDisplayNewMessage({
                    message: "An error occured when retrieving folders. Please try again later"
                });
            })
        ), { dispatch: false }
    );

    addNewFolder$ = createEffect(() =>
        this.actions$.pipe(
            ofType(FolderActions.addNewFolder),
            switchMap((action) => this.folderService.createFolder(action.folder)),
            map(() => FolderApiActions.addNewFolderSuccessful()),
            catchError(() => of(FolderApiActions.addNewFolderUnsuccessful()))
        )
    );

    addNewFolderSuccessful$ = createEffect(() =>
        this.actions$.pipe(
            ofType(FolderApiActions.addNewFolderSuccessful),
            tap(() => {
                this.messageHandlingService.onDisplayNewMessage({
                    message: "New folder added"
                });
            }),
            map(() => FolderActions.getAllFolders())
        )
    );

    addNewFolderUnsuccessful$ = createEffect(() =>
        this.actions$.pipe(
            ofType(FolderApiActions.addNewFolderUnsuccessful),
            tap(() => {
                this.messageHandlingService.onDisplayNewMessage({
                    message: "An error occured during the folder creation process. Please try again later"
                });
            })
        ), { dispatch: false }
    );

    changeFolderParent$ = createEffect(() =>
        this.actions$.pipe(
            ofType(FolderActions.changeFolderParent),
            switchMap((action) => this.folderService.changeFolderParent(action.folderId, action.parentFolderId)),
            map(() => FolderApiActions.changeFolderParentSuccessful()),
            catchError(() => of(FolderApiActions.changeFolderParentUnsuccessful()))
        )
    );

    changeFolderParentSuccessful$ = createEffect(() =>
        this.actions$.pipe(
            ofType(FolderApiActions.changeFolderParentSuccessful),
            tap(() => {
                this.messageHandlingService.onDisplayNewMessage({
                    message: "Folder moved"
                });
            })
        ), { dispatch: false }
    );

    changeFolderParentUnsuccessful$ = createEffect(() =>
        this.actions$.pipe(
            ofType(FolderApiActions.changeFolderParentUnsuccessful),
            tap(() => {
                this.messageHandlingService.onDisplayNewMessage({
                    message: "Unable to move folder. Please try again later"
                });
            })
        ), { dispatch: false }
    );

    getFolderById$ = createEffect(() =>
        this.actions$.pipe(
            ofType(FolderActions.getFolderById),
            switchMap((action) => this.folderService.getFolder(action.selectedFolderId)),
            catchError(() => of(FolderApiActions.getFolderByIdUnsuccessful()))
        ), { dispatch: false }
    );

    getFolderByIdUnsuccessful$ = createEffect(() =>
        this.actions$.pipe(
            ofType(FolderApiActions.getFolderByIdUnsuccessful),
            tap(() => {
                this.messageHandlingService.onDisplayNewMessage({
                    message: "Unable to get folder. Please try again later"
                });
            })
        ), { dispatch: false }
    );

    constructor(
        private actions$: Actions,
        private folderService: FolderService,
        private messageHandlingService: MessageHandlingService
    ) { }

}