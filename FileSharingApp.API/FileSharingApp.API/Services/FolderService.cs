using FileSharingApp.API.DAL.Interfaces;
using FileSharingApp.API.Models.Files;
using FileSharingApp.API.Services.Interfaces;

namespace FileSharingApp.API.Services
{
    public class FolderService : IFolderService
    {
        private readonly IFolderRepository folderRepository;

        public FolderService(IFolderRepository folderRepository)
        {
            this.folderRepository = folderRepository;
        }

        public void CreateFolder(Folder folder, int userId)
        {
            folderRepository.CreateFolder(folder, userId);
        }

        public IEnumerable<Folder> GetFolderList(int userId)
        {
            return folderRepository.GetFolderList(userId);
        }

        public Boolean CheckFolderName(string folderName, int userId)
        {
            return folderRepository.CheckFolderName(folderName, userId);
        }

        public void ChangeFolderParent(int id, int parentFolderId)
        {
            folderRepository.ChangeFolderParent(id, parentFolderId);
        }

        public Folder Get(int id)
        {
            return this.folderRepository.Get(id);
        }
    }
}
