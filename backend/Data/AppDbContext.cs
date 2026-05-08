using Microsoft.EntityFrameworkCore;
using QueueManagement.Models;

namespace QueueManagement.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Admin> Admins { get; set; }
    public DbSet<Token> Tokens { get; set; }
}
