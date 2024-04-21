using AutoMapper;
using FileSharingApp.API.ExtensionMethods;
using FileSharingApp.API.Models.DTOs;
using FileSharingApp.API.Models.Files;
using FileSharingApp.API.Services.Interfaces;
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
            throw new NotImplementedException();
        }

        [HttpPost]
        public Folder Post([FromBody] FolderDto folderDto)
        {
            var folder = mapper.Map<Folder>(folderDto);
            folderService.CreateFolder(folder, User.GetUserId());
            return folder;
        }

        [HttpPut("{id}")]
        public void Put(int id, [FromBody] Folder folder)
        {
            throw new NotImplementedException();
        }

        [HttpDelete("{id}")]
        public void Delete(int id)
        {
            throw new NotImplementedException();
        }
    }
}
