namespace FileSharingApp.API.Models.Files
{
    public class PdfFile : BaseFile
    {
        //public override RawUploadParams GetUploadParams(int userId)
        //{
        //    var stream = this.FileData.OpenReadStream();

        //    var uploadParams = new RawUploadParams()
        //    {
        //        File = new FileDescription(this.FileData.FileName, stream),
        //        Overwrite = true,
        //        UniqueFilename = false,
        //        UseFilename = true,
        //        RawConvert = "aspose",
        //        Folder = $"{userId}-pdf"
        //    };

        //    return uploadParams;
        //}
    }
}
