using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DDDNetCore.Migrations
{
    /// <inheritdoc />
    public partial class NomeDaMigraça2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "RequiredNumber",
                table: "OperationTypes");

            migrationBuilder.AddColumn<string>(
                name: "RequiredStaff",
                table: "OperationTypes",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "RequiredStaff",
                table: "OperationTypes");

            migrationBuilder.AddColumn<int>(
                name: "RequiredNumber",
                table: "OperationTypes",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }
    }
}
