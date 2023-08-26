using FileSharingApp.API.Models.Folders;

namespace FileSharingApp.API.Models.Files
{
    public class Folder
    {
        public int Id { get; set; }

        public string Name { get; set; } = string.Empty;

        public AppUser FolderOwner { get; set; } = null!;

        public ICollection<UserFolder>? Users { get; set; } 

        public IEnumerable<BaseFile>? Files { get; set; }

        public Folder? ParentFolder { get; set; }    

        public IEnumerable<Folder>? SubFolders { get; set; }
    }
}
