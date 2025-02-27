﻿using FileSharingApp.API.Models;
using FileSharingApp.API.Models.DTOs;
using FileSharingApp.API.Models.Files;

namespace FileSharingApp.API.DAL.Interfaces
{
    public interface IFileRepository
    {
        void SaveFile(BaseFile file, int userId);

        PaginatedResponse<BaseFile> GetFiles(FileSearchParams searchParams, int userId);

        IEnumerable<FileType> GetFileTypes(int userId);

        void DeleteFile(BaseFile fileToDelete);

        void Update(BaseFile file);

        BaseFile Get(int id);

        FileType GetFileType(string fileTypeName);

        bool FileAlreadyExists(BaseFile file, int userId);

        bool FileAlreadyExists(FileDto file, int userId);

        IEnumerable<BaseFile> GetFolderFiles(int folderId);
    }
}
