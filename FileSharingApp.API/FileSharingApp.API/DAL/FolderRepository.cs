using FileSharingApp.API.DAL.Interfaces;
using FileSharingApp.API.Data;
using FileSharingApp.API.Models.Files;
using Microsoft.EntityFrameworkCore;

namespace FileSharingApp.API.DAL
{
    public class FolderRepository : IFolderRepository
    {
        private readonly DataContext context;

        public FolderRepository(DataContext context)
        {
            this.context = context;
        }

        public void CreateFolder(Folder folder)
        {
            context.Folders.Add(folder);
            context.SaveChanges();
        }

        public void DeleteFolder(int folderId)
        {
            throw new NotImplementedException();
        }

        public Folder GetFolder(int folerId)
        {
            throw new NotImplementedException();
        }

        public IEnumerable<Folder> GetFolderList(int userId)
        {
            var folders = context.Folders
                .Where(folder => folder.FolderOwner.Id == userId)
                .Include(f => f.FolderOwner)
                .ToList();
            return folders;
        }

        public void UpdateFolder(Folder folder)
        {
            throw new NotImplementedException();
        }
    }
}
