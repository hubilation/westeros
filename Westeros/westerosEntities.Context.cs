﻿//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace Westeros
{
    using System;
    using System.Data.Entity;
    using System.Data.Entity.Infrastructure;
    
    public partial class westerosDBEntities : DbContext
    {
        public westerosDBEntities()
            : base("name=westerosDBEntities")
        {
        }
    
        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            throw new UnintentionalCodeFirstException();
        }
    
        public virtual DbSet<tblAdjacentTerritory> tblAdjacentTerritories { get; set; }
        public virtual DbSet<tblGameTerritory> tblGameTerritories { get; set; }
        public virtual DbSet<tblHouse> tblHouses { get; set; }
        public virtual DbSet<tblHouseCard> tblHouseCards { get; set; }
        public virtual DbSet<tblHouseTerritory> tblHouseTerritories { get; set; }
        public virtual DbSet<tblPlayer> tblPlayers { get; set; }
        public virtual DbSet<tblTerritory> tblTerritories { get; set; }
        public virtual DbSet<tblTerritoryArmy> tblTerritoryArmies { get; set; }
        public virtual DbSet<tblUserProfile> tblUserProfiles { get; set; }
    }
}
