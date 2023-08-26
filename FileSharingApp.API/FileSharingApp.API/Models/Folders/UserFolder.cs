using FileSharingApp.API.Models.Files;

namespace FileSharingApp.API.Models.Folders
{
    public class UserFolder
    {
        public Folder Folder { get; set; } = null!;

        public int FolderId { get; set; }

        public AppUser FolderOwner { get; set; } = null!;

        public int FolderOwnerId { get; set; }
    }
}
