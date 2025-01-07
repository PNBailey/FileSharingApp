namespace FileSharingApp.API.Models.Files
{
    public class FileSearchParams
    {
        public string? Name { get; set; }

        public int? FileTypeId { get; set; }

        public int? FolderId { get; set; }

        public string? LastModifiedStartDate { get; set; }
        
        public string? LastModifiedEndDate { get; set; }
        
        public int PreviousRows { get; set; }

        public int NextRows { get; set; }

        public string? SortField { get; set; }

        public int SortOrder { get; set; }
    }
}
