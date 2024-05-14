using FileSharingApp.API.Models.Files;

namespace FileSharingApp.API.DAL.Interfaces
{
    public interface IFolderRepository
    {
        void CreateFolder(Folder folder, int userId);

        IEnumerable<Folder> GetFolderList(int userId);

        Folder GetFolder(int folerId);

        void DeleteFolder(int folderId);

        Boolean CheckFolderName(string folderName, int userId);

        void ChangeFolderParent(int id, int parentFolderId);

        Folder Get(int id);
    }
}
