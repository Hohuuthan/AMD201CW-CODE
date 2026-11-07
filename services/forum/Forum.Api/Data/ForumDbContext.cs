using Forum.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Forum.Api.Data;

public class ForumDbContext(DbContextOptions<ForumDbContext> options) : DbContext(options)
{
    public DbSet<Post> Posts => Set<Post>();
    public DbSet<PostLike> PostLikes => Set<PostLike>();
    public DbSet<Follow> Follows => Set<Follow>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Post>(e =>
        {
            e.Property(p => p.AuthorName).HasMaxLength(50);
            e.Property(p => p.AuthorRole).HasMaxLength(20);
            e.Property(p => p.Content).HasMaxLength(1000);
            e.HasIndex(p => p.CreatedAt);    // Lay bai moi nhat cho nhanh
            e.HasIndex(p => p.AuthorId);
        });

        modelBuilder.Entity<PostLike>(e =>
        {
            e.HasKey(l => new { l.PostId, l.UserId });
            e.HasOne(l => l.Post)
             .WithMany(p => p.Likes)
             .HasForeignKey(l => l.PostId)
             .OnDelete(DeleteBehavior.Cascade);   // Xoa bai -> xoa luon cac luot tim
        });

        modelBuilder.Entity<Follow>(e =>
        {
            e.HasKey(f => new { f.FollowerId, f.FolloweeId });
            e.HasIndex(f => f.FolloweeId);
        });
    }
}
