﻿using FileSharingApp.API.Models.Files;

namespace FileSharingApp.API.DAL.Interfaces
{
    public interface IFileRepository
    {
        void UploadFile(BaseFile file);

        IEnumerable<BaseFile> GetAllFiles(int userId);
    }
}
