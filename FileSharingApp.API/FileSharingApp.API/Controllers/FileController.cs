
using AutoMapper;
using FileSharingApp.API.ExtensionMethods;
using FileSharingApp.API.Models;
using FileSharingApp.API.Models.DTOs;
using FileSharingApp.API.Models.Files;
using FileSharingApp.API.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FileSharingApp.API.Controllers
{

    [Authorize]
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
                appFile.DownloadUrl = fileService.AddFileToCloudStorage(fileUploadDto.OriginalFile, User.GetUserId(), appFile.FolderId).MediaLink;
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
            var fileToDelete = fileService.Get(id);
            fileService.DeleteFileFromCloudStorage($"{User.GetUserId()}/{fileToDelete.FolderId}/{fileToDelete.Name}");
            fileService.DeleteFile(fileToDelete);
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
                fileService.UpdateFileOnCloudStorage($"{User.GetUserId()}/{existingFile.FolderId}/{existingFile.Name}", $"{User.GetUserId()}/{file.FolderId}/{file.Name}");
                fileService.DeleteFileFromCloudStorage($"{User.GetUserId()}/{existingFile.FolderId}/{existingFile.Name}");
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

        [HttpGet("DownloadFile/{folderId}/{fileName}")]
        public IActionResult DownloadFile(int folderId, string fileName)
        {
            var (fileStream, contentType, name) = fileService.DownloadObjectFromCloudStorage($"{folderId}/{fileName}", User.GetUserId());

            Response.Headers.Add("Content-Disposition", $"attachment; filename={name}");

            return File(fileStream, contentType, name);
        }
    }
}
