
using AutoMapper;
using FileSharingApp.API.ExtensionMethods;
using FileSharingApp.API.Models;
using FileSharingApp.API.Models.DTOs;
using FileSharingApp.API.Models.Files;
using FileSharingApp.API.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace FileSharingApp.API.Controllers
{
    public class FileController : BaseController
    {
        private readonly IFileService fileService;
        private readonly IMapper mapper;

        public FileController(IFileService fileService, IMapper mapper)
        {
            this.fileService = fileService;
            this.mapper = mapper;
        }

        [HttpPost("GetFiles")]
        public PaginatedResponse<FileDto> GetFiles([FromBody]FileSearchParams searchParams)
        {
            PaginatedResponse<BaseFile> baseFilePaginatedResponse = fileService.GetFiles(searchParams, User.GetUserId());
            PaginatedResponse<FileDto> fileDtoPaginatedResponse = mapper.Map<PaginatedResponse<FileDto>>(baseFilePaginatedResponse);
            return fileDtoPaginatedResponse;
        }

        [HttpPost]
        public BaseFile Post([FromForm]FileUploadDto fileUploadDto)
        {
            if (fileUploadDto.OriginalFile == null || fileUploadDto.OriginalFile.Length == 0)
            {
                throw new ArgumentNullException("File is missing or empty.");
            }

            BaseFile appFile = fileService.CreateAppFile(fileUploadDto);
            appFile.DownloadUrl = fileService.AddFileToCloudStorage(fileUploadDto.OriginalFile).MediaLink;
            fileService.SaveFile(appFile, User.GetUserId());

            return appFile;
        }

        [HttpDelete("{fileName}")]
        public void Delete(string fileName)
        {
            fileService.DeleteFile(fileName);
        }

        [HttpPut("Update")]
        public IActionResult Update([FromBody]FileDto file)
        {
            var existingFile = fileService.Get(file.Id);

            if (existingFile == null)
            {
                return NotFound();
            }
            var fileToUpdate = mapper.Map(file, existingFile);
            fileService.Update(fileToUpdate);

            return Ok();
        }

        [HttpGet("FileTypes")]
        public IEnumerable<FileType> GetFileTypes()
        {
            return fileService.GetFileTypes(User.GetUserId());
        }

        [HttpGet("DownloadFile/{fileName}")]
        public FileStreamResult DownloadFile(string fileName)
        {
            var memoryStream = new MemoryStream();
            var obj = fileService.DownloadObjectFromCloudStorage(fileName, memoryStream);
            memoryStream.Seek(0, SeekOrigin.Begin);
            return File(memoryStream, obj.ContentType);
        }
    }
}
