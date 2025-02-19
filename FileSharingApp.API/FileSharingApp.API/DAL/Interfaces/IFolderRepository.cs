using FileSharingApp.API.Models.Folders;

namespace FileSharingApp.API.DAL.Interfaces
{
    public interface IFolderRepository
    {
        void CreateFolder(Folder folder, int userId);

        void UpdateFolder(Folder folder);

        IEnumerable<Folder> GetFolderList(int userId);

        Folder GetFolder(int folderId);

        void DeleteFolder(int id);

        Boolean CheckFolderName(string folderName, int userId);

        void ChangeFolderParent(int id, int parentFolderId);

        Folder Get(int id);

        Folder GetTopLevelFolder(int userId);
    }
}
