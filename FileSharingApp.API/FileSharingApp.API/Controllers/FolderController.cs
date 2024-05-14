using AutoMapper;
using FileSharingApp.API.ExtensionMethods;
using FileSharingApp.API.Models.DTOs;
using FileSharingApp.API.Models.Files;
using FileSharingApp.API.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FileSharingApp.API.Controllers
{
    public class FolderController : BaseController
    {
        private readonly IFolderService folderService;
        private readonly IMapper mapper;
        private readonly IUserService userService;

        public FolderController(
            IFolderService folderService, 
            IMapper mapper,
            IUserService userService)
        {
            this.folderService = folderService;
            this.mapper = mapper;
            this.userService = userService;
        }

        [HttpGet]
        public IEnumerable<Folder> Get()
        {
            return folderService.GetFolderList(User.GetUserId());
        }

        [HttpGet("{id}")]
        public Folder Get(int id)
        {
            return this.folderService.Get(id);
        }

        [HttpPost]
        public Folder Post([FromBody] FolderDto folderDto)
        {
            var folder = mapper.Map<Folder>(folderDto);
            folderService.CreateFolder(folder, User.GetUserId());
            return folder;
        }

        [HttpPost("ChangeFolderParent/{id}/{parentFolderId}")]
        public void ChangeFolderParent(int id, int parentFolderId)
        {
            this.folderService.ChangeFolderParent(id, parentFolderId);
        }

        [HttpDelete("{id}")]
        public void Delete(int id)
        {
            throw new NotImplementedException();
        }

        [AllowAnonymous]
        [HttpGet("CheckFolderName")]
        public Boolean CheckFolderName([FromQuery] string folderName)
        {
            return folderService.CheckFolderName(folderName, User.GetUserId());
        }
    }
}
