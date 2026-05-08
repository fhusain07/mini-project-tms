namespace QueueManagement.Models;

public class Token
{
    public int Id { get; set; }
    public int TokenNumber { get; set; }
    public string CustomerName { get; set; } = string.Empty;
    public string Status { get; set; } = "Waiting";
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
