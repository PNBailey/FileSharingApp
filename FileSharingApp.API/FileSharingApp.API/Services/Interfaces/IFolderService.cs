using FileSharingApp.API.Models.Folders;

namespace FileSharingApp.API.Services.Interfaces
{
    public interface IFolderService
    {
        void CreateFolder(Folder folder, int userId);

        void UpdateFolder(Folder folder);

        IEnumerable<Folder> GetFolderList(int userId);

        bool CheckFolderName(string folderName, int userId);

        void ChangeFolderParent(int id, int parentFolderId);

        Folder Get(int id);

        Folder GetTopLevelFolder(int userId);

        void DeleteFolder(int id);

    }
}
