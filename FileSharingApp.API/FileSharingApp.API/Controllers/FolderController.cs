using AutoMapper;
using FileSharingApp.API.ExtensionMethods;
using FileSharingApp.API.Models.DTOs;
using FileSharingApp.API.Models.Folders;
using FileSharingApp.API.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FileSharingApp.API.Controllers
{

    [Authorize]
    public class FolderController : BaseController
    {
        private readonly IFolderService folderService;
        private readonly IMapper mapper;
        private readonly IFileService fileService;

        public FolderController(
            IFolderService folderService, 
            IMapper mapper,
            IFileService fileService)
        {
            this.folderService = folderService;
            this.mapper = mapper;
            this.fileService = fileService;
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

        [HttpPut]
        public Folder Put([FromBody] FolderDto folderDto)
        {
            var folder = mapper.Map<Folder>(folderDto);
            if (folder.ParentFolderId == null)
            {
                folder.ParentFolderId = folderService.GetTopLevelFolder(User.GetUserId()).Id;
            }
            folderService.UpdateFolder(folder);
            return folder;
        }

        [HttpPost("ChangeFolderParent/{id}/{parentFolderId}")]
        public void ChangeFolderParent(int id, int parentFolderId)
        {
            folderService.ChangeFolderParent(id, parentFolderId);
        }

        [HttpDelete("{id}")]
        public ActionResult Delete(int id)
        {
            if(id == folderService.GetTopLevelFolder(User.GetUserId()).Id)
            {
                return BadRequest("Unable to delete My Drive folder");
            }
            fileService.DeleteAllFolderFiles(id);
            folderService.DeleteFolder(id);
            return Ok();
        }

        [AllowAnonymous]
        [HttpGet("CheckFolderName")]
        public bool CheckFolderName([FromQuery] string folderName)
        {
            return folderService.CheckFolderName(folderName, User.GetUserId());
        }
    }
}
