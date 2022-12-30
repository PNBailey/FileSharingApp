using System.Net;

namespace FileSharingApp.API.Services.Interfaces
{
    public interface IErrorService
    {
        HttpStatusCode GetStatusCode(Exception exception);
    }
}
