using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DDDNetCore.Migrations
{
    /// <inheritdoc />
    public partial class operationtypeSS : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_OperationTypes",
                table: "OperationTypes");

            migrationBuilder.AddPrimaryKey(
                name: "PK_OperationTypes",
                table: "OperationTypes",
                columns: new[] { "Id", "Active" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_OperationTypes",
                table: "OperationTypes");

            migrationBuilder.AddPrimaryKey(
                name: "PK_OperationTypes",
                table: "OperationTypes",
                column: "Id");
        }
    }
}
