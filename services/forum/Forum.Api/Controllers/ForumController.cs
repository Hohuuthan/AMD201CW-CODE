using Forum.Api.Data;
using Forum.Api.DTOs;
using Forum.Api.Models;
using Forum.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Forum.Api.Controllers;

// Moi API o day deu can dang nhap (gui kem token)
[ApiController]
[Route("api/forum")]
[Authorize]
public class ForumController(ForumDbContext db) : ControllerBase
{
    // GET /api/forum/posts?filter=all|experts|following
    [HttpGet("posts")]
    public async Task<ActionResult<List<PostDto>>> GetPosts([FromQuery] string filter = "all")
    {
        if (CurrentUser.Id(User) is not Guid me) return Unauthorized();

        var query = db.Posts.AsQueryable();

        if (filter == "experts")
        {
            query = query.Where(p => p.AuthorRole == "Expert");
        }
        else if (filter == "following")
        {
            var followees = db.Follows.Where(f => f.FollowerId == me).Select(f => f.FolloweeId);
            query = query.Where(p => followees.Contains(p.AuthorId));
        }

        var posts = await query
            .OrderByDescending(p => p.CreatedAt)
            .Take(50)
            .Select(p => new PostDto(
                p.Id,
                p.AuthorId,
                p.AuthorName,
                p.AuthorRole == "Expert",
                p.AuthorId == me,
                db.Follows.Any(f => f.FollowerId == me && f.FolloweeId == p.AuthorId),
                p.Content,
                p.CreatedAt,
                p.Likes.Count,
                p.Likes.Any(l => l.UserId == me)))
            .ToListAsync();

        return Ok(posts);
    }

    // POST /api/forum/posts   { "content": "..." }
    [HttpPost("posts")]
    public async Task<ActionResult<PostDto>> CreatePost(CreatePostRequest req)
    {
        if (CurrentUser.Id(User) is not Guid me) return Unauthorized();

        var content = req.Content.Trim();
        if (content.Length == 0) return BadRequest(new ErrorResponse("Your post can't be empty."));

        var post = new Post
        {
            AuthorId = me,
            AuthorName = CurrentUser.Name(User),
            AuthorRole = CurrentUser.Role(User),
            Content = content,
        };
        db.Posts.Add(post);
        await db.SaveChangesAsync();

        var dto = new PostDto(post.Id, me, post.AuthorName, post.AuthorRole == "Expert", true, false,
            post.Content, post.CreatedAt, 0, false);
        return Created($"/api/forum/posts/{post.Id}", dto);
    }

    // DELETE /api/forum/posts/{id}   (chi chu bai hoac Admin)
    [HttpDelete("posts/{id:guid}")]
    public async Task<IActionResult> DeletePost(Guid id)
    {
        if (CurrentUser.Id(User) is not Guid me) return Unauthorized();

        var post = await db.Posts.FindAsync(id);
        if (post is null) return NotFound(new ErrorResponse("Post not found."));
        if (post.AuthorId != me && !User.IsInRole("Admin"))
            return StatusCode(403, new ErrorResponse("	You can only delete your own posts."));

        db.Posts.Remove(post);
        await db.SaveChangesAsync();
        return NoContent();
    }

    // POST /api/forum/posts/{id}/like   -> tim
    [HttpPost("posts/{id:guid}/like")]
    public async Task<ActionResult<LikeResult>> Like(Guid id)
    {
        if (CurrentUser.Id(User) is not Guid me) return Unauthorized();
        if (!await db.Posts.AnyAsync(p => p.Id == id)) return NotFound(new ErrorResponse("Post not found."));

        // Bam tim 2 lan cung chi tinh 1 (khong loi)
        if (!await db.PostLikes.AnyAsync(l => l.PostId == id && l.UserId == me))
        {
            db.PostLikes.Add(new PostLike { PostId = id, UserId = me });
            await db.SaveChangesAsync();
        }

        return Ok(new LikeResult(await db.PostLikes.CountAsync(l => l.PostId == id), true));
    }

    // DELETE /api/forum/posts/{id}/like   -> bo tim
    [HttpDelete("posts/{id:guid}/like")]
    public async Task<ActionResult<LikeResult>> Unlike(Guid id)
    {
        if (CurrentUser.Id(User) is not Guid me) return Unauthorized();

        var like = await db.PostLikes.FindAsync(id, me);
        if (like is not null)
        {
            db.PostLikes.Remove(like);
            await db.SaveChangesAsync();
        }

        return Ok(new LikeResult(await db.PostLikes.CountAsync(l => l.PostId == id), false));
    }

    // POST /api/forum/follows/{authorId}   -> theo doi
    [HttpPost("follows/{authorId:guid}")]
    public async Task<IActionResult> Follow(Guid authorId)
    {
        if (CurrentUser.Id(User) is not Guid me) return Unauthorized();
        if (authorId == me) return BadRequest(new ErrorResponse("You can't follow yourself."));

        if (!await db.Follows.AnyAsync(f => f.FollowerId == me && f.FolloweeId == authorId))
        {
            db.Follows.Add(new Follow { FollowerId = me, FolloweeId = authorId });
            await db.SaveChangesAsync();
        }
        return NoContent();
    }

    // DELETE /api/forum/follows/{authorId}   -> bo theo doi
    [HttpDelete("follows/{authorId:guid}")]
    public async Task<IActionResult> Unfollow(Guid authorId)
    {
        if (CurrentUser.Id(User) is not Guid me) return Unauthorized();

        var follow = await db.Follows.FindAsync(me, authorId);
        if (follow is not null)
        {
            db.Follows.Remove(follow);
            await db.SaveChangesAsync();
        }
        return NoContent();
    }
}
