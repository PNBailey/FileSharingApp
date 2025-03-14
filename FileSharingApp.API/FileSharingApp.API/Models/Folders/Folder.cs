﻿using FileSharingApp.API.Models.Files;
using FileSharingApp.API.Models.Folders;

namespace FileSharingApp.API.Models.Folders
{
    public class Folder
    {
        public int Id { get; set; }

        public string Name { get; set; } = string.Empty;

        public string? Description { get; set; }

        public AppUser FolderOwner { get; set; } = null!;

        public ICollection<UserFolder>? Users { get; set; }

        public IEnumerable<AppFile>? Files { get; set; }

        public int? ParentFolderId { get; set; }

        public Folder? ParentFolder { get; set; }

        public IEnumerable<Folder>? SubFolders { get; set; }
    }
}
