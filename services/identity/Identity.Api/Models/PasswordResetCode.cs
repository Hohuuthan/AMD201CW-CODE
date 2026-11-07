namespace Identity.Api.Models;

// Ma 6 so de dat lai mat khau khi quen.
// Chi luu ban da bam (giong mat khau), song 15 phut, nhap sai toi da 5 lan.
public class PasswordResetCode
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;

    public string CodeHash { get; set; } = "";
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime ExpiresAt { get; set; }
    public int FailedAttempts { get; set; }
    public DateTime? UsedAt { get; set; }      // Da dung hoac da bi huy (co ma moi hon)
}
