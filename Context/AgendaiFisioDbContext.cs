using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using AgendaiFisio.Entities;


namespace AgendaiFisio.Context
{
    public class AgendaiFisioDbContext : DbContext
    {
        public AgendaiFisioDbContext(DbContextOptions<AgendaiFisioDbContext> options) : base(options)
        {
        }

        public DbSet<Usuario> Usuarios { get; set; }
        public DbSet<Paciente> Pacientes { get; set; }
        public DbSet<Profissional> Profissionais { get; set; }
        public DbSet<AvaliacaoFisioterapeuta> AvaliacaoFisioterapeuta { get; set; }
        public DbSet<PlanoTerapeutico> PlanosTerapeutico { get; set; }
        public DbSet<Endereco> Enderecos { get; set; }



        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {

            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<AvaliacaoFisioterapeuta>()
                .HasOne(a => a.Plano)
                .WithOne(p => p.AvaliacaoFisioterapeuta)
                .HasForeignKey<PlanoTerapeutico>(p => p.AvaliacaoFisioterapeutaId);

                modelBuilder.Entity<Usuario>()
                .HasIndex(u => u.Email)
                .IsUnique();

            modelBuilder.Entity<AvaliacaoFisioterapeuta>()
                .HasOne(a => a.Profissional)
                .WithMany()
                .HasForeignKey(a => a.ProfissionalId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<AvaliacaoFisioterapeuta>()
                .HasOne(a => a.Paciente)
                .WithMany()
                .HasForeignKey(a => a.PacienteId)
                .OnDelete(DeleteBehavior.Restrict);
        }
        
    }
}