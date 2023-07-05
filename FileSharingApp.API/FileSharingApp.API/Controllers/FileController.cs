
using Microsoft.AspNetCore.Mvc;

namespace FileSharingApp.API.Controllers
{
    public class FileController : BaseController
    {
        //[HttpGet]
        //public IEnumerable<File> Get()
        //{
        //    throw new NotImplementedException();
        //}

        //[HttpGet("{id}")]
        //public string Get(int id)
        //{
        //    return "value";
        //}

        [HttpPost]
        public IFormFile Post([FromForm]IFormFile file)
        {
            return file;
        }

        //[HttpPut("{id}")]
        //public void Put(IFormFile file)
        //{
        //}

        //[HttpDelete("{id}")]
        //public void Delete(int id)
        //{
        //}
    }
}
