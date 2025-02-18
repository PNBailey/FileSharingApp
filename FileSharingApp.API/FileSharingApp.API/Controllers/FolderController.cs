using AutoMapper;
using FileSharingApp.API.ExtensionMethods;
using FileSharingApp.API.Models.DTOs;
using FileSharingApp.API.Models.Folders;
using FileSharingApp.API.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FileSharingApp.API.Controllers
{
    public class FolderController : BaseController
    {
        private readonly IFolderService folderService;
        private readonly IMapper mapper;

        public FolderController(
            IFolderService folderService, 
            IMapper mapper)
        {
            this.folderService = folderService;
            this.mapper = mapper;
        }

        [HttpGet]
        public IEnumerable<Folder> Get()
        {
            return folderService.GetFolderList(User.GetUserId());
        }

        [HttpGet("{id}")]
        public Folder Get(int id)
        {
            return folderService.Get(id);
        }

        [HttpPost]
        public Folder Post([FromBody] FolderDto folderDto)
        {
            var folder = mapper.Map<Folder>(folderDto);
            if(folder.ParentFolderId == null)
            {
                folder.ParentFolderId = folderService.GetTopLevelFolder(User.GetUserId()).Id;
            }
            folderService.CreateFolder(folder, User.GetUserId());
            return folder;
        }

        [HttpPost("ChangeFolderParent/{id}/{parentFolderId}")]
        public void ChangeFolderParent(int id, int parentFolderId)
        {
            folderService.ChangeFolderParent(id, parentFolderId);
        }

        [HttpDelete("{id}")]
        public void Delete(int id)
        {
            throw new NotImplementedException();
        }

        [AllowAnonymous]
        [HttpGet("CheckFolderName")]
        public bool CheckFolderName([FromQuery] string folderName)
        {
            return folderService.CheckFolderName(folderName, User.GetUserId());
        }
    }
}
