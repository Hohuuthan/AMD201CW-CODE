using System.ComponentModel.DataAnnotations;

namespace Forum.Api.DTOs;

// Du lieu app gui len
public record CreatePostRequest([Required, StringLength(1000, MinimumLength = 1)] string Content);

// Du lieu tra ve cho app (da tinh san cho nguoi dang xem)
public record PostDto(
    Guid Id,
    Guid AuthorId,
    string AuthorName,
    bool IsExpert,          // Tac gia la chuyen gia -> huy hieu Verified Expert
    bool IsMine,            // Bai cua chinh minh -> hien nut xoa, an nut Follow
    bool FollowingAuthor,   // Minh dang theo doi tac gia chua
    string Content,
    DateTime CreatedAt,
    int LikeCount,
    bool LikedByMe);

public record LikeResult(int LikeCount, bool LikedByMe);

public record ErrorResponse(string Message);
