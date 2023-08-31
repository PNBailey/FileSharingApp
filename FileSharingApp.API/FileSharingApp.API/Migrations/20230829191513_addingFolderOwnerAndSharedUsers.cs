using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FileSharingApp.API.Migrations
{
    public partial class addingFolderOwnerAndSharedUsers : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "Folders",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "FolderOwnerId",
                table: "Folders",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "UserFolder",
                columns: table => new
                {
                    FolderId = table.Column<int>(type: "int", nullable: false),
                    FolderOwnerId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserFolder", x => new { x.FolderId, x.FolderOwnerId });
                    table.ForeignKey(
                        name: "FK_UserFolder_AspNetUsers_FolderOwnerId",
                        column: x => x.FolderOwnerId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_UserFolder_Folders_FolderId",
                        column: x => x.FolderId,
                        principalTable: "Folders",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Folders_FolderOwnerId",
                table: "Folders",
                column: "FolderOwnerId");

            migrationBuilder.CreateIndex(
                name: "IX_UserFolder_FolderOwnerId",
                table: "UserFolder",
                column: "FolderOwnerId");

            migrationBuilder.AddForeignKey(
                name: "FK_Folders_AspNetUsers_FolderOwnerId",
                table: "Folders",
                column: "FolderOwnerId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.NoAction);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Folders_AspNetUsers_FolderOwnerId",
                table: "Folders");

            migrationBuilder.DropTable(
                name: "UserFolder");

            migrationBuilder.DropIndex(
                name: "IX_Folders_FolderOwnerId",
                table: "Folders");

            migrationBuilder.DropColumn(
                name: "Description",
                table: "Folders");

            migrationBuilder.DropColumn(
                name: "FolderOwnerId",
                table: "Folders");
        }
    }
}
