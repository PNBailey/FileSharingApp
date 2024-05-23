using FileSharingApp.API.DAL.Interfaces;
using FileSharingApp.API.Data;
using FileSharingApp.API.Models.Files;

namespace FileSharingApp.API.DAL
{
    public class FileRepository : IFileRepository
    {
        private readonly DataContext context;

        public FileRepository(DataContext context)
        {
            this.context = context;
        }

        public IEnumerable<BaseFile> GetAllFiles(int userId)
        {
            var files = context.Files
                .Where(f => f.FileOwner.Id == userId)
                .ToList();
            return files;
        }

        public void UploadFile(BaseFile file)
        {
            context.Files.Add(file);
            context.SaveChanges();
        }

        public IEnumerable<BaseFile> GetFolderFiles(int folderId, int userId)
        {
            return context.Files
                .Where(f => f.Folder != null && f.Folder.Id == folderId && f.FileOwner.Id == userId)
                .ToList();
        }

        public void DeleteFile(string url)
        {
            var fileToRemove = context.Files.FirstOrDefault(file => file.Url == url);
            if (fileToRemove != null) 
            { 
                context.Files.Remove(fileToRemove);
            }

            context.SaveChanges();
        }

        public void Update(BaseFile file)
        {
            context.Files.Update(file);
            context.SaveChanges();
        }

        public BaseFile Get(int id)
        {
            return context.Files.First(f => f.Id == id);
        }
    }
}
