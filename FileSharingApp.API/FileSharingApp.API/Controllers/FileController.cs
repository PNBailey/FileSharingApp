
using AutoMapper;
using FileSharingApp.API.ExtensionMethods;
using FileSharingApp.API.Models.DTOs;
using FileSharingApp.API.Models.Files;
using FileSharingApp.API.Services;
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

        [HttpGet]
        public IEnumerable<FileDto> Get()
        {
            var files = this.fileService.GetAllFiles(User.GetUserId());
            var fileDtos = this.mapper.Map<IEnumerable<FileDto>>(files);
            return fileDtos;
        }

        //[HttpGet("{id}")]
        //public string Get(int id)
        //{
        //    return "value";
        //}

        [HttpPost]
        public async Task<FileDto> Post([FromForm]IFormFile fileData)
        {
            var fileExtension = Path.GetExtension(fileData.FileName);
            var fileTypeName = this.fileService.GetFileTypeName(fileExtension);
            BaseFile newFile = (BaseFile)this.fileService.CreateFileType(fileTypeName);
            newFile.FileData = fileData;
            var uploadedfile = await this.fileService.UploadFile(newFile, User.GetUserId());
            var fileDto = mapper.Map<FileDto>(uploadedfile);
            return fileDto;
        }

        [HttpGet("Folder/{folderId}")]
        public IEnumerable<FileDto> GetFolderFiles(int folderId)
        {
            var files = this.fileService.GetFolderFiles(folderId, User.GetUserId());
            var fileDtos = this.mapper.Map<IEnumerable<FileDto>>(files);
            return fileDtos;
        }
    }
}
