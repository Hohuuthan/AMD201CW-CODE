using Forum.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Forum.Api.Data;

// Tao vai bai dang mau khi database con trong, de demo co noi dung de xem.
// Chi chay khi "SeedSamplePosts": true (appsettings.Development.json). Khi deploy that thi tat.
public static class ForumSeeder
{
    // Id co dinh cho tac gia mau (khong phai tai khoan that trong Identity)
    private static readonly Guid Linh = Guid.Parse("11111111-1111-1111-1111-111111111111");
    private static readonly Guid Minh = Guid.Parse("22222222-2222-2222-2222-222222222222");
    private static readonly Guid An = Guid.Parse("33333333-3333-3333-3333-333333333333");

    public static async Task SeedAsync(ForumDbContext db, IConfiguration config, ILogger logger)
    {
        if (!config.GetValue<bool>("SeedSamplePosts")) return;
        if (await db.Posts.AnyAsync()) return;

        var now = DateTime.UtcNow;
        db.Posts.AddRange(
            new Post
            {
                AuthorId = Linh, AuthorName = "Linh Tran", AuthorRole = "Expert", CreatedAt = now.AddHours(-2),
                Content = "Guide: how often should you water a Snake Plant in Saigon weather? Short answer — less than you think. Wait until the soil is fully dry.",
            },
            new Post
            {
                AuthorId = Minh, AuthorName = "Minh Pham", AuthorRole = "User", CreatedAt = now.AddHours(-5),
                Content = "Day 30 of my balcony Pothos with TreeO auto-watering. New leaves every week!",
            },
            new Post
            {
                AuthorId = An, AuthorName = "Dr. An Nguyen", AuthorRole = "Expert", CreatedAt = now.AddDays(-1),
                Content = "Yellow leaves on a Money Tree are usually about roots, not light. Check drainage before adding fertiliser.",
            });

        await db.SaveChangesAsync();
        logger.LogInformation("Da tao 3 bai dang mau cho Forum");
    }
}
