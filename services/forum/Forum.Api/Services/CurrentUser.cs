using System.Security.Claims;

namespace Forum.Api.Services;

// Doc thong tin nguoi dang goi API tu token (token do Identity service cap).
// Forum khong can hoi Identity: chu ky cua token da chung minh token la that.
public static class CurrentUser
{
    public static Guid? Id(ClaimsPrincipal user)
    {
        var id = user.FindFirstValue(ClaimTypes.NameIdentifier) ?? user.FindFirstValue("sub");
        return Guid.TryParse(id, out var guid) ? guid : null;
    }

    public static string Name(ClaimsPrincipal user) =>
        user.FindFirstValue("name") ?? user.FindFirstValue(ClaimTypes.Name) ?? "TreeO user";

    public static string Role(ClaimsPrincipal user) =>
        user.IsInRole("Admin") ? "Admin" : user.IsInRole("Expert") ? "Expert" : "User";
}
