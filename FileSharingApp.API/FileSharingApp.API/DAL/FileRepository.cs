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

        public IEnumerable<BaseFile> GetFiles(FileSearchParams searchParams, int userId)
        {
            var filteredFiles = context.Files
                .Where(f =>
                    f.FileOwner.Id == userId &&
                    (string.IsNullOrEmpty(searchParams.Name) || f.Name.StartsWith(searchParams.Name)) &&
                    (string.IsNullOrEmpty(searchParams.Description) || (f.Description != null && f.Description.StartsWith(searchParams.Description))) &&
                    (!searchParams.FolderId.HasValue || searchParams.FolderId == f.FolderId)
                )
                .ToList();

            return filteredFiles;
        }

        public void UploadFile(BaseFile file)
        {
            context.Files.Add(file);
            context.SaveChanges();
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
