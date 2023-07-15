
using CloudinaryDotNet.Actions;
using FileSharingApp.API.ExtensionMethods;
using FileSharingApp.API.Models.Files;
using FileSharingApp.API.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace FileSharingApp.API.Controllers
{
    public class FileController : BaseController
    {
        private readonly IFileService fileService;

        public FileController(IFileService fileService)
        {
            this.fileService = fileService;
        }

        //[HttpGet]
        //public IEnumerable<File> Get()
        //{
        //    throw new NotImplementedException();
        //}

        //[HttpGet("{id}")]
        //public string Get(int id)
        //{
        //    return "value";
        //}

        [HttpPost]
        public async Task<RawUploadResult> Post([FromForm]IFormFile fileData)
        {
            BaseFile newFile = (BaseFile)this.fileService.CreateFileType(fileData.ContentType);
            newFile.FileData = fileData;
            var uploadResult = await this.fileService.UploadFile(newFile, User.GetUserId());
            return uploadResult;
        }

        //[HttpPut("{id}")]
        //public void Put(IFormFile file)
        //{
        //}

        //[HttpDelete("{id}")]
        //public void Delete(int id)
        //{
        //}
    }
}
