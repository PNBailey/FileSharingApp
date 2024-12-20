namespace FileSharingApp.API.Models.Files
{
    public class FileSearchParams
    {
        public string? Name { get; set; }

        public int? FileTypeId { get; set; }

        public int? FolderId { get; set; }

        public DateTime? LastModifiedStartDate { get; set; }
        
        public DateTime? LastModifiedEndDate { get; set; }
    }
}
