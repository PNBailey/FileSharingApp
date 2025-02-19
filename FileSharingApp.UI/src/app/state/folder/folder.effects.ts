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
        )
    );

    addNewFolder$ = createEffect(() =>
        this.actions$.pipe(
            ofType(FolderActions.addNewFolder),
            switchMap((action) => this.folderService.createFolder(action.folder)),
            map(() => FolderApiActions.addNewFolderSuccessful()),
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

    editFolder$ = createEffect(() =>
        this.actions$.pipe(
            ofType(FolderActions.editFolder),
            switchMap((action) => this.folderService.updateFolder(action.folder)),
            map(() => FolderApiActions.editFolderSuccessful()),
        )
    );

    editFolderSuccessful$ = createEffect(() =>
        this.actions$.pipe(
            ofType(FolderApiActions.editFolderSuccessful),
            tap(() => {
                this.messageHandlingService.onDisplayNewMessage({
                    message: "Folder updated"
                });
            }),
            map(() => FolderActions.getAllFolders())
        )
    );

    changeFolderParent$ = createEffect(() =>
        this.actions$.pipe(
            ofType(FolderActions.changeFolderParent),
            switchMap((action) => this.folderService.changeFolderParent(action.folderId, action.parentFolderId)),
            map(() => FolderApiActions.changeFolderParentSuccessful()),
        )
    );

    changeFolderParentSuccessful$ = createEffect(() =>
        this.actions$.pipe(
            ofType(FolderApiActions.changeFolderParentSuccessful),
            tap(() => {
                this.messageHandlingService.onDisplayNewMessage({
                    message: "Folder moved"
                });
            }),
            map(() => FolderActions.getAllFolders())
        )
    );

    getFolderById$ = createEffect(() =>
        this.actions$.pipe(
            ofType(FolderActions.getFolderById),
            switchMap((action) => this.folderService.getFolder(action.selectedFolderId)),
        ), { dispatch: false }
    );

    deleteFolder$ = createEffect(() =>
        this.actions$.pipe(
            ofType(FolderActions.deleteFolder),
            switchMap((action) => this.folderService.deleteFolder(action.folderId)),
            map(() => FolderApiActions.deleteFolderSuccessful()),
        )
    );

    deleteFolderSuccessful$ = createEffect(() =>
        this.actions$.pipe(
            ofType(FolderApiActions.deleteFolderSuccessful),
            tap(() => {
                this.messageHandlingService.onDisplayNewMessage({
                    message: "Folder deleted"
                });
            }),
            map(() => FolderActions.getAllFolders())
        )
    );

    constructor(
        private actions$: Actions,
        private folderService: FolderService,
        private messageHandlingService: MessageHandlingService
    ) { }

}