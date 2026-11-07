using System.Security.Cryptography;
using Identity.Api.Data;
using Identity.Api.DTOs;
using Identity.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Identity.Api.Services;

// Quen mat khau:
// 1. RequestAsync: nguoi dung nhap email -> tao ma 6 so, gui qua email
// 2. ResetAsync: nguoi dung nhap email + ma + mat khau moi -> doi mat khau, dang nhap luon
public class PasswordResetService(
    IdentityDbContext db,
    AuthService auth,
    IEmailSender email,
    ILogger<PasswordResetService> logger)
{
    private static readonly TimeSpan CodeLifetime = TimeSpan.FromMinutes(15);
    private static readonly TimeSpan ResendCooldown = TimeSpan.FromSeconds(60);
    private const int MaxAttempts = 5;
    private const string InvalidCode = "The code is wrong or has expired.";

    public async Task RequestAsync(string rawEmail)
    {
        var emailAddress = rawEmail.Trim().ToLowerInvariant();
        var user = await db.Users.FirstOrDefaultAsync(u => u.Email == emailAddress);

        // Email khong ton tai: van im lang tra ve thanh cong,
        // de nguoi la khong dung chuc nang nay de do xem email nao da dang ky
        if (user is null) return;

        var now = DateTime.UtcNow;
        var active = await db.PasswordResetCodes
            .Where(c => c.UserId == user.Id && c.UsedAt == null && c.ExpiresAt > now)
            .ToListAsync();

        // Chong spam: 60 giay moi duoc xin ma moi 1 lan
        if (active.Any(c => now - c.CreatedAt < ResendCooldown)) return;

        // Ma cu bi huy, chi ma moi nhat co hieu luc
        foreach (var old in active) old.UsedAt = now;

        var code = RandomNumberGenerator.GetInt32(0, 1_000_000).ToString("D6");
        db.PasswordResetCodes.Add(new PasswordResetCode
        {
            UserId = user.Id,
            CodeHash = BCrypt.Net.BCrypt.HashPassword(code),
            ExpiresAt = now.Add(CodeLifetime),
        });
        await db.SaveChangesAsync();

        try
        {
            await email.SendAsync(
                user.Email,
                "TreeO - Mã đặt lại mật khẩu / Password reset code",
                $"Xin chào {user.DisplayName},\n\n" +
                $"Mã đặt lại mật khẩu TreeO của bạn là: {code}\n" +
                "Mã có hiệu lực trong 15 phút. Nếu bạn không yêu cầu, hãy bỏ qua email này.\n\n" +
                $"Your TreeO password reset code is: {code}\n" +
                "It expires in 15 minutes. If you didn't ask for it, ignore this email.");
        }
        catch (Exception ex)
        {
            // Gui email loi (sai cau hinh Smtp...): ghi log, khong bao cho nguoi dung biet chi tiet
            logger.LogError(ex, "Khong gui duoc email dat lai mat khau toi {Email}", user.Email);
        }
    }

    public async Task<AuthResponse> ResetAsync(ResetPasswordRequest req)
    {
        var emailAddress = req.Email.Trim().ToLowerInvariant();
        var user = await db.Users.Include(u => u.RefreshTokens).FirstOrDefaultAsync(u => u.Email == emailAddress)
            ?? throw new AuthException(InvalidCode, 400);

        var now = DateTime.UtcNow;
        var reset = await db.PasswordResetCodes
            .Where(c => c.UserId == user.Id && c.UsedAt == null && c.ExpiresAt > now)
            .OrderByDescending(c => c.CreatedAt)
            .FirstOrDefaultAsync()
            ?? throw new AuthException(InvalidCode, 400);

        if (!BCrypt.Net.BCrypt.Verify(req.Code.Trim(), reset.CodeHash))
        {
            reset.FailedAttempts++;
            // Sai qua 5 lan -> huy ma, phai xin ma moi (chong do mo 000000-999999)
            if (reset.FailedAttempts >= MaxAttempts)
            {
                reset.UsedAt = now;
                await db.SaveChangesAsync();
                throw new AuthException("Too many wrong attempts. Please request a new code.", 400);
            }
            await db.SaveChangesAsync();
            throw new AuthException(InvalidCode, 400);
        }

        user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(req.NewPassword);
        reset.UsedAt = now;

        // Dang xuat moi thiet bi dang dung mat khau cu
        foreach (var token in user.RefreshTokens.Where(t => t.RevokedAt == null))
            token.RevokedAt = now;

        await db.SaveChangesAsync();
        return await auth.IssueTokensAsync(user);
    }
}
