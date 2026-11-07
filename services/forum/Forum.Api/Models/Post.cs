namespace Forum.Api.Models;

// Mot bai dang trong cong dong
public class Post
{
    public Guid Id { get; set; } = Guid.NewGuid();

    // Thong tin tac gia lay tu token luc dang bai (Forum khong doc database cua Identity)
    public Guid AuthorId { get; set; }
    public string AuthorName { get; set; } = "";
    public string AuthorRole { get; set; } = "User";   // "Expert" -> hien huy hieu Verified Expert

    public string Content { get; set; } = "";
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public List<PostLike> Likes { get; set; } = [];
}

// Mot luot "tim" cua 1 nguoi cho 1 bai. Moi nguoi chi tim 1 bai 1 lan (khoa chinh gom 2 cot)
public class PostLike
{
    public Guid PostId { get; set; }
    public Post Post { get; set; } = null!;
    public Guid UserId { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

// Nguoi A (Follower) theo doi nguoi B (Followee)
public class Follow
{
    public Guid FollowerId { get; set; }
    public Guid FolloweeId { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
