
using AutoMapper;
using FileSharingApp.API.ExtensionMethods;
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

        [HttpGet]
        public IEnumerable<FileDto> Get([FromQuery]FileSearchParams searchParams)
        {
            var files = fileService.GetFiles(searchParams, User.GetUserId());
            var fileDtos = mapper.Map<IEnumerable<FileDto>>(files);
            return fileDtos;
        }

        [HttpPost]
        public void Post([FromForm]FileUploadDto fileUploadDto)
        {
            BaseFile appFile = fileService.CreateAppFile(fileUploadDto);
            fileService.UploadFile(appFile, User.GetUserId());
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
    }
}
