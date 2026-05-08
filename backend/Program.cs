using Microsoft.EntityFrameworkCore;
using QueueManagement.Data;
using QueueManagement.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services
builder.Services.AddControllers();

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
        policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
});

var app = builder.Build();

// Auto-create tables and seed admin user
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.EnsureCreated();

    if (!db.Admins.Any())
    {
        db.Admins.Add(new Admin { Username = "admin", Password = "admin123" });
        db.SaveChanges();
    }
}

app.UseCors("AllowAll");
app.MapControllers();

app.Run("http://localhost:5000");
