using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Westeros.Code
{
    public static class UI
    {
        /// <summary>Runs the designated script after the page loads</summary>
        /// <param name="command">a javascript command: like alert('hi')</param>
        public static HtmlString RunScriptOnLoad(string command)
        {
            return new HtmlString("<script type='text/javascript'>$(function(){" + command + ";});</script>");
        }
    }
}