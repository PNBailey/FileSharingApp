namespace FileSharingApp.API.Models
{
    public class PaginatedResponse<T>
    {
        public int TotalRecords { get; set; }

        public IEnumerable<T>? Items { get; set; }
    }
}
