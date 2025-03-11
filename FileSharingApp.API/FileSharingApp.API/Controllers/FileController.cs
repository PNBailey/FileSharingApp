
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

        public FileController(
            IFileService fileService, 
            IMapper mapper)
        {
            this.fileService = fileService;
            this.mapper = mapper;
        }

        [HttpPost("GetFiles")]
        public PaginatedResponse<FileDto> GetFiles([FromBody]FileSearchParams searchParams)
        {
            PaginatedResponse<AppFile> baseFilePaginatedResponse = fileService.GetFiles(searchParams, User.GetUserId());
            PaginatedResponse<FileDto> fileDtoPaginatedResponse = mapper.Map<PaginatedResponse<FileDto>>(baseFilePaginatedResponse);
            return fileDtoPaginatedResponse;
        }

        [HttpPost]
        public ActionResult<AppFile> Post([FromForm]FileUploadDto fileUploadDto)
        {
            if (fileUploadDto.OriginalFile == null || fileUploadDto.OriginalFile.Length == 0)
            {
                throw new ArgumentNullException("File is missing or empty.");
            }

            AppFile appFile = fileService.CreateAppFile(fileUploadDto);

            if (!fileService.FileAlreadyExists(appFile, User.GetUserId()))
            {
                appFile.DownloadUrl = fileService.AddFileToCloudStorage(fileUploadDto.OriginalFile, User.GetUserId()).MediaLink;
                fileService.AddFile(appFile, User.GetUserId());
            }
            else
            {
                return BadRequest("File already exists");
            }


            return appFile;
        }

        [HttpDelete("{id}")]
        public void Delete(int id)
        {
            fileService.DeleteFile(id);
        }

        [HttpPut("Update")]
        public IActionResult Update([FromBody]FileDto file)
        {
            var existingFile = fileService.Get(file.Id);
            if (existingFile == null)
            {
                return NotFound("Unable to locate file to update");
            }
            if(fileService.HasFileNameOrFolderChanged(existingFile, file) && fileService.FileAlreadyExists(file, User.GetUserId()))
            {
                return BadRequest("File already exists in this location");
            }
            if(existingFile.Name != file.Name)
            {
                fileService.UpdateFileOnCloudStorage(existingFile.Name, file.Name);
            }
            var updatedFile = mapper.Map(file, existingFile);
            fileService.Update(updatedFile);
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
