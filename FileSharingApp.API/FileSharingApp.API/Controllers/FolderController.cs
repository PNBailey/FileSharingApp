using FileSharingApp.API.Models.Files;
using Microsoft.AspNetCore.Mvc;

namespace FileSharingApp.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FolderController : BaseController
    {
        [HttpGet]
        public IEnumerable<Folder> Get()
        {
            throw new NotImplementedException();
        }

        [HttpGet("{id}")]
        public Folder Get(int id)
        {
            throw new NotImplementedException();
        }

        [HttpPost]
        public void Post([FromBody] string value)
        {
            throw new NotImplementedException();
        }

        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
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
