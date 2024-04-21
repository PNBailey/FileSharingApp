using FileSharingApp.API.Models.Files;

namespace FileSharingApp.API.DAL.Interfaces
{
    public interface IFolderRepository
    {
        void CreateFolder(Folder folder, int userId);

        IEnumerable<Folder> GetFolderList(int userId);

        Folder GetFolder(int folerId);

        void UpdateFolder(Folder folder);

        void DeleteFolder(int folderId);
    }
}
