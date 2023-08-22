using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FileSharingApp.API.Migrations
{
    public partial class AddingFolders : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Folders",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Folders", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "BaseFileFolder",
                columns: table => new
                {
                    FileId = table.Column<int>(type: "int", nullable: false),
                    FolderId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BaseFileFolder", x => new { x.FileId, x.FolderId });
                    table.ForeignKey(
                        name: "FK_BaseFileFolder_Files_FileId",
                        column: x => x.FileId,
                        principalTable: "Files",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_BaseFileFolder_Folders_FolderId",
                        column: x => x.FolderId,
                        principalTable: "Folders",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "FolderFolder",
                columns: table => new
                {
                    ParentFolderId = table.Column<int>(type: "int", nullable: false),
                    SubFolderId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FolderFolder", x => new { x.ParentFolderId, x.SubFolderId });
                    table.ForeignKey(
                        name: "FK_FolderFolder_Folders_ParentFolderId",
                        column: x => x.ParentFolderId,
                        principalTable: "Folders",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_FolderFolder_Folders_SubFolderId",
                        column: x => x.SubFolderId,
                        principalTable: "Folders",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_BaseFileFolder_FolderId",
                table: "BaseFileFolder",
                column: "FolderId");

            migrationBuilder.CreateIndex(
                name: "IX_FolderFolder_SubFolderId",
                table: "FolderFolder",
                column: "SubFolderId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "BaseFileFolder");

            migrationBuilder.DropTable(
                name: "FolderFolder");

            migrationBuilder.DropTable(
                name: "Folders");
        }
    }
}
