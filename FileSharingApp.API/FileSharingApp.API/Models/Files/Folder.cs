namespace FileSharingApp.API.Models.Files
{
    public class Folder
    {
        public int Id { get; set; }

        public string Name { get; set; } = string.Empty;

        public IEnumerable<BaseFile>? Files { get; set; }

        public Folder? ParentFolder { get; set; }    

        public IEnumerable<Folder>? SubFolders { get; set; }
    }
}
