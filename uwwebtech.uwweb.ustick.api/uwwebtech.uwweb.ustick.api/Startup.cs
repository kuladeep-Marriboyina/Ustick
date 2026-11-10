using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.OpenApi.Models;
using Newtonsoft.Json.Serialization;
using uwwebtech.uwweb.ustick.api.Middleware;

namespace uwwebtech.uwweb.ustick.api
{
    public class Startup
    {
        private const string AngularDevCors = "AngularDev";
        private readonly IConfiguration _configuration;

        public Startup(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public void ConfigureServices(IServiceCollection services)
        {
            CompositionRoot.ServiceCollectionExtensions.ConfigureServices(services, _configuration);

            services.AddCors(options =>
            {
                options.AddPolicy(AngularDevCors, policy =>
                    policy.WithOrigins("http://localhost:4200")
                          .AllowAnyHeader()
                          .AllowAnyMethod());
            });

            // Single demo student this pass -> no JWT auth yet.
            // Later: services.AddAuthentication("Bearer").AddJwtBearer(...) against UWorld IdentityServer.

            services.AddControllers()
                .AddNewtonsoftJson(options =>
                {
                    options.SerializerSettings.ContractResolver = new CamelCasePropertyNamesContractResolver();
                });

            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "UStick API", Version = "v1" });
                c.CustomSchemaIds(type => type.FullName);
            });
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseSwagger();
                app.UseSwaggerUI(c => c.SwaggerEndpoint("v1/swagger.json", "UStick API V1"));
            }

            app.UseMiddleware<CustomExceptionMiddleware>();
            app.UseRouting();
            app.UseCors(AngularDevCors);
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
                endpoints.MapSwagger();
            });
        }
    }
}
