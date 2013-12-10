using System;
using System.Data.Entity.Core.EntityClient;
using System.Data.Linq;
using Microsoft.WindowsAzure.ServiceRuntime;
using System.Configuration;

namespace Westeros
{
    public class WesterosDataAccess
    {
        private static string _connectionString;

        public DataContext Context { get; private set; }

        public WesterosDataAccess(string connectionStringKey = "westerosConnectionString")
        {
            var contextConnectionString = GetContextConnectionString(connectionStringKey);

            if (string.IsNullOrEmpty(_connectionString))
                throw new Exception("Unable to find a connection string");

            var ecsb = new EntityConnectionStringBuilder(contextConnectionString);

            Context = new DataContext(ecsb.ConnectionString);
        }

        private string GetContextConnectionString(string connectionStringKey)
        {
            if (_connectionString == null)
            {
                string databaseInfo = RoleEnvironment.IsAvailable ? RoleEnvironment.GetConfigurationSettingValue(connectionStringKey) : ConfigurationManager.ConnectionStrings[connectionStringKey].ConnectionString;

                //bool isBase64Encoded = !databaseInfo.Contains("Data Source");

                //if (isBase64Encoded)
                //{
                //    databaseInfo = ConnectionStringDecrypter.Decrypt(databaseInfo);
                //}

                _connectionString = databaseInfo;
            }

            const string formatEntityFrameWorkConnectionString = @"metadata=res://*/westerosEntities.csdl|res://*/westerosEntities.ssdl|res://*/westerosEntities.msl;
                    provider=System.Data.SqlClient;
                    provider connection string='{0} 
                    Persist Security Info=True;
                    App=EntityFramework'";

            return string.Format(formatEntityFrameWorkConnectionString, _connectionString);
        }
    }
}