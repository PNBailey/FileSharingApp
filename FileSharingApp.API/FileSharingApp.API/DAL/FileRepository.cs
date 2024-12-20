using FileSharingApp.API.DAL.Interfaces;
using FileSharingApp.API.Data;
using FileSharingApp.API.Models.Files;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System.Globalization;

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
            //DateTime? startDate = null;
            //DateTime? endDate = null;

            //if (!string.IsNullOrEmpty(searchParams.LastModifiedRange))
            //{
            //    var dateParts = searchParams.LastModifiedRange.Split(',');
            //    if (dateParts.Length == 2)
            //    {
            //        if (DateTime.TryParse(dateParts[0], out var parsedStartDate))
            //        {
            //            startDate = parsedStartDate;
            //        }

            //        if (DateTime.TryParse(dateParts[1], out var parsedEndDate))
            //        {
            //            endDate = parsedEndDate;
            //        }
            //    }
            //}

            var filteredFiles = context.Files
                .Include(f => f.FileType)
                .Where(f =>
                    f.FileOwner.Id == userId &&
                    (string.IsNullOrEmpty(searchParams.Name) || f.Name.StartsWith(searchParams.Name)) &&
                    (!searchParams.FileTypeId.HasValue || searchParams.FileTypeId == f.FileType.Id) &&
                    (!searchParams.FolderId.HasValue || searchParams.FolderId == f.FolderId) &&
                    (!searchParams.LastModifiedStartDate.HasValue || f.LastModified >= searchParams.LastModifiedStartDate) &&
                    (!searchParams.LastModifiedEndDate.HasValue || f.LastModified <= searchParams.LastModifiedEndDate))
                .ToList();

            return filteredFiles;
        }

        public IEnumerable<FileType> GetFileTypes(int userId)
        {
            var fileTypes = context.Files
                .Where(file => file.FileOwner.Id == userId)
                .Select(file => file.FileType)
                .Distinct()
                .ToList();

            return fileTypes;
        }

        public void UploadFile(BaseFile file, int userId)
        {
            file.FileType = context.FileTypes.FirstOrDefault(ft => ft.Name == file.FileTypeName)
                ?? throw new Exception($"FileType not found for FileTypeName: {file.FileTypeName}");

            file.FileOwner = context.Users.FirstOrDefault(u => u.Id == userId)
                ?? throw new Exception($"No user found with id: {userId}");

            if (!context.Files.Any(f => f.Name == file.Name))
            {
                context.Files.Add(file);
                context.SaveChanges();
            }
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

        private DateTime ParseDate(string dateString)
        {
            string format = "ddd MMM dd yyyy"; // Custom format matching the string

            DateTime.TryParseExact(dateString, format, CultureInfo.InvariantCulture, DateTimeStyles.None, out DateTime parsedDate);

            return parsedDate;
        }
    }
}
