using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Hosting;
using System.IO;

namespace DDDSample1
{
    public class Program
    {
        public static void Main(string[] args)
        {
            CreateHostBuilder(args).Build().Run();
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.UseContentRoot(Directory.GetCurrentDirectory());
                    webBuilder.UseStartup<Startup>();
                    webBuilder.UseUrls("http://localhost:5000", "https://localhost:5001", "http://*:5000", "https://*:5001", "http://10.9.21.142:5000", "https://10.9.21.142:5001", "https://0.0.0.0:5001", "http://0.0.0.0:5001");
                });
        }
}
