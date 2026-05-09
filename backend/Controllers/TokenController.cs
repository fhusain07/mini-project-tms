using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QueueManagement.Data;
using QueueManagement.Models;

namespace QueueManagement.Controllers;

[ApiController]
[Route("api/token")]
public class TokenController : ControllerBase
{
    private readonly AppDbContext _db;

    public TokenController(AppDbContext db)
    {
        _db = db;
    }

    // POST /api/token/generate
    [HttpPost("generate")]
    public async Task<IActionResult> GenerateToken([FromBody] GenerateTokenRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.CustomerName))
            return BadRequest(new { message = "Customer name is required" });

        var lastToken = await _db.Tokens
            .OrderByDescending(t => t.TokenNumber)
            .FirstOrDefaultAsync();

        int nextNumber = lastToken == null ? 1 : lastToken.TokenNumber + 1;

        var token = new Token
        {
            TokenNumber = nextNumber,
            CustomerName = request.CustomerName.Trim(),
            Status = "Waiting",
            CreatedAt = DateTime.UtcNow
        };

        _db.Tokens.Add(token);
        await _db.SaveChangesAsync();

        return Ok(token);
    }

    // GET /api/token/all
    [HttpGet("all")]
    public async Task<IActionResult> GetAllTokens([FromQuery] DateTime? startDate, [FromQuery] DateTime? endDate)
    {
        var query = _db.Tokens.AsQueryable();

        if (startDate.HasValue)
        {
            var start = DateTime.SpecifyKind(
            startDate.Value.Date,
            DateTimeKind.Utc);
            query = query.Where(t => t.CreatedAt >= start);
        }

        if (endDate.HasValue)
        {
            var endExclusive = DateTime.SpecifyKind(
                endDate.Value.Date.AddDays(1),
                DateTimeKind.Utc
            );

            query = query.Where(t => t.CreatedAt < endExclusive);
        }
        var tokens = await query
              .OrderBy(t => t.TokenNumber)
              .ToListAsync();
        return Ok(tokens);
    }

    // GET /api/token/current
    [HttpGet("current")]
    public async Task<IActionResult> GetCurrentToken()
    {
        var token = await _db.Tokens
            .FirstOrDefaultAsync(t => t.Status == "Active");
        return Ok(token);
    }

    // GET /api/token/stats
    [HttpGet("stats")]
    public async Task<IActionResult> GetStats()
    {
        var waiting = await _db.Tokens.CountAsync(t => t.Status == "Waiting");
        var active = await _db.Tokens.CountAsync(t => t.Status == "Active");
        var completed = await _db.Tokens.CountAsync(t => t.Status == "Completed");

        return Ok(new { waiting, active, completed });
    }

    // POST /api/token/next
    [HttpPost("next")]
    public async Task<IActionResult> CallNextToken()
    {
        // Complete currently active token
        var activeToken = await _db.Tokens
            .FirstOrDefaultAsync(t => t.Status == "Active");

        if (activeToken != null)
            activeToken.Status = "Completed";

        // Activate next waiting token
        var nextToken = await _db.Tokens
            .Where(t => t.Status == "Waiting")
            .OrderBy(t => t.TokenNumber)
            .FirstOrDefaultAsync();

        if (nextToken == null)
        {
            await _db.SaveChangesAsync();
            return Ok(new { message = "No waiting tokens in queue" });
        }

        nextToken.Status = "Active";
        await _db.SaveChangesAsync();

        return Ok(nextToken);
    }

    // PUT /api/token/complete/{id}
    [HttpPut("complete/{id}")]
    public async Task<IActionResult> CompleteToken(int id)
    {
        var token = await _db.Tokens.FindAsync(id);
        if (token == null)
            return NotFound(new { message = "Token not found" });

        token.Status = "Completed";
        await _db.SaveChangesAsync();

        return Ok(token);
    }

    // DELETE /api/token/reset
    [HttpDelete("reset")]
    public async Task<IActionResult> ResetQueue()
    {
        _db.Tokens.RemoveRange(_db.Tokens);
        await _db.SaveChangesAsync();
        return Ok(new { message = "Queue has been reset successfully" });
    }
}

public class GenerateTokenRequest
{
    public string CustomerName { get; set; } = string.Empty;
}
