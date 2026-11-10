using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using uwwebtech.uwweb.ustick.application.Services;
using uwwebtech.uwweb.ustick.infrastructure.Models;
using uwwebtech.uwweb.ustick.infrastructure.Repositories;

namespace uwwebtech.uwweb.ustick.api.CompositionRoot
{
    public static class ServiceCollectionExtensions
    {
        public static void ConfigureServices(IServiceCollection services, IConfiguration configuration)
        {
            services.Configure<DbConnections>(configuration.GetSection("ConnectionStrings"));

            AddApplication(services);
            AddInfrastructure(services);
        }

        private static void AddApplication(IServiceCollection services)
        {
            services.AddScoped<IStickyNoteService, StickyNoteService>();
        }

        private static void AddInfrastructure(IServiceCollection services)
        {
            services.AddScoped<IStickyNoteRepository, StickyNoteRepository>();
        }
    }
}
