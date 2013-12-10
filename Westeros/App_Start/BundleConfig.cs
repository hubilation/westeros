using System.Collections.Generic;
using System.Web;
using System.Web.Optimization;

namespace Westeros
{
    public class BundleConfig
    {
        // For more information on bundling, visit http://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                        "~/Scripts/jquery-{version}.js"));

            bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include(
                        "~/Scripts/jquery.validate*"));

            bundles.Add(new ScriptBundle("~/bundles/westeros").Include(
                        MainBundle));

            // Use the development version of Modernizr to develop with and learn from. Then, when you're
            // ready for production, use the build tool at http://modernizr.com to pick only the tests you need.
            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
                        "~/Scripts/modernizr-*"));

            bundles.Add(new StyleBundle("~/Content/css").Include(
                      "~/Content/site.css"));
        }

        private static string[] MainBundle
        {
            get
            {
                return new List<string>
                {
                    "~/Scripts/knockout-3.0.0.debug.js",
                    "~/Scripts/kinetic-v4.4.3.min.js",
                    "~/Scripts/westeros.main.js",
                    "~/Scripts/westeros.utilities.js",
                    "~/Scripts/westeros.utilities.paths.js",
                }.ToArray();
            }
        }
    }
}
