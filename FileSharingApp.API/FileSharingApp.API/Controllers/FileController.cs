
using AutoMapper;
using FileSharingApp.API.ExtensionMethods;
using FileSharingApp.API.Models.DTOs;
using FileSharingApp.API.Models.Files;
using FileSharingApp.API.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System.Web;

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

        [HttpGet]
        public IEnumerable<FileDto> Get()
        {
            var files = fileService.GetAllFiles(User.GetUserId());
            var fileDtos = mapper.Map<IEnumerable<FileDto>>(files);
            return fileDtos;
        }

        //[HttpGet("{id}")]
        //public string Get(int id)
        //{
        //    return "value";
        //}

        [HttpPost("{folderId?}")]
        public async Task<FileDto> Post(int? folderId, [FromForm]IFormFile file)
        {
            var fileExtension = Path.GetExtension(file.FileName);
            var fileTypeName = fileService.GetFileTypeName(fileExtension);
            BaseFile newFile = (BaseFile)fileService.CreateFileType(fileTypeName);
            newFile.FileData = file;
            newFile.FolderId = folderId;
            var uploadedfile = await fileService.UploadFile(newFile, User.GetUserId());
            var fileDto = mapper.Map<FileDto>(uploadedfile);
            return fileDto;
        }

        [HttpGet("Folder/{folderId}")]
        public IEnumerable<FileDto> GetFolderFiles(int folderId)
        {
            var files = fileService.GetFolderFiles(folderId, User.GetUserId());
            var fileDtos = mapper.Map<IEnumerable<FileDto>>(files);
            return fileDtos;
        }

        [HttpDelete("{url}")]
        public void Delete(string url)
        {
            string decodedUrl = HttpUtility.UrlDecode(url);
            fileService.DeleteFile(decodedUrl);
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
    }
}
