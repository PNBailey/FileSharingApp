using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FileSharingApp.API.Migrations
{
    public partial class AddingProfilePictureNameProp : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ProfilePictureName",
                table: "AspNetUsers",
                type: "nvarchar(max)",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ProfilePictureName",
                table: "AspNetUsers");
        }
    }
}
