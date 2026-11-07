using System.Net;
using System.Net.Mail;

namespace Identity.Api.Services;

// Gui email. Co 2 cach:
// - Da cau hinh "Smtp:Host" -> gui email that (vd. Gmail, xem huong dan trong README)
// - Chua cau hinh -> chi in noi dung email ra terminal (de chay thu tren may, khong ton tien)
public interface IEmailSender
{
    Task SendAsync(string to, string subject, string body);
}

public class SmtpSettings
{
    public string Host { get; set; } = "";
    public int Port { get; set; } = 587;
    public string User { get; set; } = "";
    public string Password { get; set; } = "";     // Luu bang user-secrets, khong ghi vao file
    public string From { get; set; } = "";
    public string FromName { get; set; } = "TreeO";
}

public class SmtpEmailSender(SmtpSettings settings) : IEmailSender
{
    public async Task SendAsync(string to, string subject, string body)
    {
        using var client = new SmtpClient(settings.Host, settings.Port)
        {
            EnableSsl = true,
            Credentials = new NetworkCredential(settings.User, settings.Password),
        };
        var from = string.IsNullOrWhiteSpace(settings.From) ? settings.User : settings.From;
        using var message = new MailMessage(new MailAddress(from, settings.FromName), new MailAddress(to))
        {
            Subject = subject,
            Body = body,
        };
        await client.SendMailAsync(message);
    }
}

public class LogEmailSender(ILogger<LogEmailSender> logger) : IEmailSender
{
    public Task SendAsync(string to, string subject, string body)
    {
        logger.LogWarning("===== EMAIL (chua cau hinh Smtp nen chi in ra day) =====\nTo: {To}\nSubject: {Subject}\n{Body}\n=====", to, subject, body);
        return Task.CompletedTask;
    }
}
