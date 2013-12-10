using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(Westeros.Startup))]
namespace Westeros
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
