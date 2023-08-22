namespace FileSharingApp.API.Models.Files
{
    public class Folder
    {
        public int Id { get; set; }

        public string Name { get; set; } = string.Empty;

        public IEnumerable<BaseFile>? File { get; set; }

        public IEnumerable<Folder>? ParentFolder { get; set; }    

        public IEnumerable<Folder>? SubFolder { get; set; }
    }
}
