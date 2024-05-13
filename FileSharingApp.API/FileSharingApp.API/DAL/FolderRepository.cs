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

        public void CreateFolder(Folder folder, int userId)
        {
            folder.FolderOwner = context.Users.First(user => user.Id == userId);
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

        public Boolean CheckFolderName(string folderName, int userId)
        {
            return context.Folders.Any(folder => folder.Name == folderName && folder.FolderOwner.Id == userId);
        }

        public IEnumerable<Folder> GetFolderList(int userId)
        {
            var folders = context.Folders
                .Where(folder => folder.FolderOwner.Id == userId)
                .Include(f => f.SubFolders)
                .ThenInclude(sf => sf.SubFolders)
                .ThenInclude(sf => sf.SubFolders)
                .ThenInclude(sf => sf.SubFolders)
                .ThenInclude(sf => sf.SubFolders)
                .ThenInclude(sf => sf.SubFolders)
                .ThenInclude(sf => sf.SubFolders)
                .ThenInclude(sf => sf.SubFolders)
                .ThenInclude(sf => sf.SubFolders)
                .ThenInclude(sf => sf.SubFolders)
                .ThenInclude(sf => sf.SubFolders)
                .AsNoTracking()
                .ToList();
            return folders;
        }

        public void ChangeFolderParent(int id, int parentFolderId)
        {
            context.Folders.First(f => f.Id == id).ParentFolderId = parentFolderId;
            context.SaveChanges();
        }
    }
}
