﻿using FileSharingApp.API.DAL.Interfaces;
using FileSharingApp.API.Data;
using FileSharingApp.API.Models;
using FileSharingApp.API.Models.DTOs;
using FileSharingApp.API.Models.Files;
using Microsoft.EntityFrameworkCore;

namespace FileSharingApp.API.DAL
{
    public class FileRepository : IFileRepository
    {
        private readonly DataContext context;

        public FileRepository(DataContext context)
        {
            this.context = context;
        }

        public PaginatedResponse<AppFile> GetFiles(FileSearchParams searchParams, int userId)
        {
            IQueryable<AppFile> filteredFiles = GetFilteredFiles(searchParams, userId);

            IOrderedEnumerable<AppFile> sortedFilteredFiles = SortFiles(filteredFiles, searchParams);

            PaginatedResponse<AppFile> paginatedResponse = new()
            {
                TotalRecords = sortedFilteredFiles.Count(),
                Items = sortedFilteredFiles
                    .Skip(searchParams.PreviousRows)
                    .Take(searchParams.NextRows)
                    .ToList()
            };

            return paginatedResponse;
        }

        private IQueryable<AppFile> GetFilteredFiles(FileSearchParams searchParams, int userId)
        {
            return context.Files
                .Where(f =>
                    f.FileOwner.Id == userId &&
                    searchParams.FolderId == f.FolderId &&
                    (string.IsNullOrEmpty(searchParams.Name) || f.Name.StartsWith(searchParams.Name)) &&
                    (!searchParams.FileTypeId.HasValue || searchParams.FileTypeId == f.FileTypeId) &&
                    (string.IsNullOrEmpty(searchParams.LastModifiedStartDate) || f.LastModified >= DateTime.Parse(searchParams.LastModifiedStartDate) &&
                    (string.IsNullOrEmpty(searchParams.LastModifiedEndDate) || f.LastModified <= SetToEndOfDay(DateTime.Parse(searchParams.LastModifiedEndDate)))))
                .Include(f => f.FileType);
        }

        private static DateTime SetToEndOfDay(DateTime date)
        {
            return date.Date.AddDays(1).AddTicks(-1);
        }

        private static IOrderedEnumerable<AppFile> SortFiles(IQueryable<AppFile> filteredFiles, FileSearchParams searchParams)
        {
            Func<AppFile, object> keySelector = searchParams.SortField switch
            {
                "fileType.name" => file => file.FileType.Name,
                "name" => file => file.Name,
                "lastModified" => file => file.LastModified,
                "size" => file => file.Size,
                _ => file => file.FileType.Name
            };

            return searchParams.SortOrder == 1
                ? filteredFiles.OrderBy(keySelector)
                : filteredFiles.OrderByDescending(keySelector);
        }

        public IEnumerable<FileType> GetFileTypes(int userId)
        {
            var fileTypes = context.FileTypes
                .ToList();

            return fileTypes;
        }

        public FileType GetFileType(string fileTypeName)
        {
            return context.FileTypes.FirstOrDefault(ft => ft.Name == fileTypeName)
                ?? throw new Exception($"FileType not found for FileTypeName: {fileTypeName}");
        }

        public void AddFile(AppFile file, int userId)
        {
            file.FileOwner = context.Users.SingleOrDefault(u => u.Id == userId)
                ?? throw new Exception($"No user found with id: {userId}");

            if (!FileAlreadyExists(file, userId))
            {
                context.Files.Add(file);
                context.SaveChanges();
            } 
            else
            {
                throw new Exception($"File already exists");
            }
        }

        public bool FileAlreadyExists(AppFile file, int userId)
        {
            return CheckFileExists(file.Name, userId, file.FolderId);
        }

        public bool FileAlreadyExists(FileDto file, int userId)
        {
            return CheckFileExists(file.Name, userId, file.FolderId);
        }

        private bool CheckFileExists(string name, int userId, int? folderId)
        {
            return context.Files.Any(f => f.Name == name && f.FileOwner.Id == userId && f.FolderId == folderId);
        }

        public void DeleteFile(AppFile fileToDelete)
        {
            if (fileToDelete != null) 
            { 
                context.Files.Remove(fileToDelete);
            }
            context.SaveChanges();
        }

        public void Update(AppFile file)
        {
            context.Files.Update(file);
            context.SaveChanges();
        }

        public AppFile Get(int id)
        {
            return context.Files.FirstOrDefault(f => f.Id == id)
                ?? throw new Exception($"File not found");
        }

        public IEnumerable<AppFile> GetFolderFiles(int folderId)
        {
            return context.Files.Where(f => f.FolderId == folderId);
        }
    }
}
