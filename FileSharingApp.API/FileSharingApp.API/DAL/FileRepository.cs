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
            var files = this.context.Files
                .Where(f => f.FileOwner.Id == userId)
                .ToList();
            return files;
        }

        public void UploadFile(BaseFile file)
        {
            this.context.Files.Add(file);
            this.context.SaveChanges();
        }
    }
}
