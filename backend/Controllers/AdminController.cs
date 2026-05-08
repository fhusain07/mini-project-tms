using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QueueManagement.Data;

namespace QueueManagement.Controllers;

[ApiController]
[Route("api/admin")]
public class AdminController : ControllerBase
{
    private readonly AppDbContext _db;

    public AdminController(AppDbContext db)
    {
        _db = db;
    }

    // POST /api/admin/login
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        var admin = await _db.Admins.FirstOrDefaultAsync(
            a => a.Username == request.Username && a.Password == request.Password);

        if (admin == null)
            return Unauthorized(new { message = "Invalid username or password" });

        return Ok(new { message = "Login successful", username = admin.Username });
    }
}

public class LoginRequest
{
    public string Username { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}
