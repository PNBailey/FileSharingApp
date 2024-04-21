using FileSharingApp.API.Models.Files;

namespace FileSharingApp.API.Services.Interfaces
{
    public interface IFolderService
    {
        void CreateFolder(Folder folder, int userId);

        IEnumerable<Folder> GetFolderList(int userId);
    }
}
