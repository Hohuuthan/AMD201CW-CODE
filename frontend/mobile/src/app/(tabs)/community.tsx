// Man Community: xem bai (tat ca / chuyen gia / dang theo doi), tim, theo doi, dang va xoa bai.
// Du lieu that tu Forum service (services/forum).
import { useCallback, useState } from "react";
import { ActivityIndicator, Pressable, RefreshControl, ScrollView, View } from "react-native";
import { router, useFocusEffect } from "expo-router";
import { Screen } from "../../components/Screen";
import { Card } from "../../components/Card";
import { Icon } from "../../components/Icon";
import { Txt } from "../../components/Txt";
import { useAuth } from "../../auth/AuthContext";
import { forumApi, type Post, type PostFilter } from "../../api/forum";
import { timeAgo, useLang } from "../../i18n/LanguageContext";
import { colors, radius } from "../../theme";

const AVATAR_COLORS = ["#2E7D32", "#00796B", "#558B2F", "#33691E", "#00695C"];

// Mau avatar co dinh theo tung nguoi (cung id -> cung mau)
function avatarColor(id: string) {
  let sum = 0;
  for (const ch of id) sum += ch.charCodeAt(0);
  return AVATAR_COLORS[sum % AVATAR_COLORS.length];
}

function initial(name: string) {
  return name.replace(/^Dr\.?\s*/i, "").charAt(0).toUpperCase();
}

export default function CommunityScreen() {
  const { authFetch } = useAuth();
  const { t, lang } = useLang();
  const api = forumApi(authFetch);

  const [filter, setFilter] = useState<PostFilter>("all");
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(
    async (which: PostFilter, mode: "initial" | "refresh" = "initial") => {
      if (mode === "refresh") setRefreshing(true);
      else setLoading(true);
      setError(null);
      try {
        setPosts(await forumApi(authFetch).list(which));
      } catch (e) {
        setError((e as Error).message);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [authFetch],
  );

  // Moi lan quay lai tab nay (vd. vua dang bai xong) thi tai lai
  useFocusEffect(
    useCallback(() => {
      load(filter);
    }, [load, filter]),
  );

  function patchPost(id: string, change: Partial<Post>) {
    setPosts((list) => list.map((p) => (p.id === id ? { ...p, ...change } : p)));
  }

  // Tim / bo tim: cap nhat giao dien ngay, loi thi tra lai nhu cu
  async function toggleLike(p: Post) {
    const liked = !p.likedByMe;
    patchPost(p.id, { likedByMe: liked, likeCount: p.likeCount + (liked ? 1 : -1) });
    try {
      const res = liked ? await api.like(p.id) : await api.unlike(p.id);
      patchPost(p.id, res);
    } catch (e) {
      patchPost(p.id, { likedByMe: p.likedByMe, likeCount: p.likeCount });
      setError((e as Error).message);
    }
  }

  // Theo doi / bo theo doi tac gia: cap nhat moi bai cua tac gia do
  async function toggleFollow(p: Post) {
    const follow = !p.followingAuthor;
    const setFor = (value: boolean) =>
      setPosts((list) => list.map((x) => (x.authorId === p.authorId ? { ...x, followingAuthor: value } : x)));
    setFor(follow);
    try {
      if (follow) await api.follow(p.authorId);
      else await api.unfollow(p.authorId);
      // Dang o tab Following ma bo theo doi -> an bai cua nguoi do
      if (!follow && filter === "following") setPosts((list) => list.filter((x) => x.authorId !== p.authorId));
    } catch (e) {
      setFor(!follow);
      setError((e as Error).message);
    }
  }

  async function remove(p: Post) {
    const before = posts;
    setPosts((list) => list.filter((x) => x.id !== p.id));
    try {
      await api.remove(p.id);
    } catch (e) {
      setPosts(before);
      setError((e as Error).message);
    }
  }

  const filters: { key: PostFilter; label: string }[] = [
    { key: "all", label: t.allPosts },
    { key: "experts", label: t.expertGuides },
    { key: "following", label: t.following },
  ];
  const emptyText = { all: t.emptyAll, experts: t.emptyExperts, following: t.emptyFollowing }[filter];

  return (
    <Screen>
      {/* Dau trang + bo loc */}
      <View style={{ paddingHorizontal: 20, paddingTop: 20, paddingBottom: 12, gap: 14, backgroundColor: "#FFFFFF", borderBottomWidth: 1, borderBottomColor: colors.divider }}>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          <Txt size={24} weight="bold" accessibilityRole="header">{t.community}</Txt>
          <Pressable
            onPress={() => router.push("/new-post")}
            accessibilityRole="button"
            style={{ height: 40, paddingHorizontal: 14, borderRadius: 12, backgroundColor: colors.primary, flexDirection: "row", alignItems: "center", gap: 6 }}
          >
            <Icon name="plus" size={16} color="#FFFFFF" strokeWidth={2.4} />
            <Txt weight="semibold" color="#FFFFFF">{t.createPost}</Txt>
          </Pressable>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }} accessibilityRole="tablist">
          {filters.map(({ key, label }) => {
            const on = filter === key;
            return (
              <Pressable
                key={key}
                accessibilityRole="tab"
                accessibilityState={{ selected: on }}
                onPress={() => setFilter(key)}
                style={{ height: 36, paddingHorizontal: 14, borderRadius: radius.pill, borderWidth: 1, borderColor: on ? colors.primary : colors.border, backgroundColor: on ? colors.primary : "#FFFFFF", justifyContent: "center" }}
              >
                <Txt size={13} weight="semibold" color={on ? "#FFFFFF" : colors.text}>{label}</Txt>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      <ScrollView
        contentContainerStyle={{ padding: 20, gap: 14, flexGrow: 1 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => load(filter, "refresh")} tintColor={colors.primary} colors={[colors.primary]} />}
      >
        {error && (
          <View accessibilityRole="alert" style={{ flexDirection: "row", gap: 10, alignItems: "center", backgroundColor: "#FDECEC", borderRadius: 12, padding: 12 }}>
            <Icon name="alert" size={18} color={colors.danger} />
            <Txt size={13} weight="medium" color={colors.danger} style={{ flex: 1 }}>{error}</Txt>
            <Pressable onPress={() => load(filter)} accessibilityRole="button" hitSlop={8}>
              <Txt size={13} weight="semibold" color={colors.danger}>{t.retry}</Txt>
            </Pressable>
          </View>
        )}

        {loading && posts.length === 0 && <ActivityIndicator color={colors.primary} style={{ marginTop: 32 }} />}

        {!loading && !error && posts.length === 0 && (
          <Txt color={colors.muted} align="center" style={{ marginTop: 32, paddingHorizontal: 12, lineHeight: 21 }}>{emptyText}</Txt>
        )}

        {posts.map((p) => (
          <Card key={p.id}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
              <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: avatarColor(p.authorId), alignItems: "center", justifyContent: "center" }}>
                <Txt size={15} weight="semibold" color="#FFFFFF">{initial(p.authorName)}</Txt>
              </View>
              <View style={{ flex: 1, gap: 2 }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                  <Txt weight="semibold">{p.authorName}</Txt>
                  {p.isExpert && (
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 3, backgroundColor: colors.primarySoft, paddingVertical: 2, paddingHorizontal: 8, borderRadius: radius.pill }}>
                      <Icon name="check" size={12} color={colors.primaryDark} strokeWidth={3} />
                      <Txt size={11} weight="semibold" color={colors.primaryDark}>{t.verifiedExpert}</Txt>
                    </View>
                  )}
                </View>
                <Txt size={12} color={colors.muted}>{timeAgo(p.createdAt, t, lang)}</Txt>
              </View>

              {p.isMine ? (
                <Txt size={12} weight="semibold" color={colors.muted}>{t.you}</Txt>
              ) : (
                <Pressable
                  accessibilityRole="button"
                  accessibilityState={{ selected: p.followingAuthor }}
                  onPress={() => toggleFollow(p)}
                  style={{ height: 32, paddingHorizontal: 12, borderRadius: radius.pill, borderWidth: 1, borderColor: colors.primary, backgroundColor: p.followingAuthor ? colors.primary : "#FFFFFF", justifyContent: "center" }}
                >
                  <Txt size={12} weight="semibold" color={p.followingAuthor ? "#FFFFFF" : colors.primary}>{p.followingAuthor ? t.following : t.follow}</Txt>
                </Pressable>
              )}
            </View>

            <Txt style={{ lineHeight: 21 }}>{p.content}</Txt>

            <View style={{ flexDirection: "row", alignItems: "center", gap: 18 }}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={p.likedByMe ? t.unlike : t.like}
                accessibilityState={{ selected: p.likedByMe }}
                onPress={() => toggleLike(p)}
                style={{ height: 36, flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 6 }}
              >
                <Icon name="heart" size={20} color={p.likedByMe ? colors.danger : colors.muted} fill={p.likedByMe ? "#E53935" : "none"} />
                <Txt size={13} weight="semibold" color={p.likedByMe ? colors.danger : colors.muted}>{p.likeCount}</Txt>
              </Pressable>
              <View style={{ flex: 1 }} />
              {p.isMine && (
                <Pressable
                  accessibilityRole="button"
                  onPress={() => remove(p)}
                  style={{ height: 36, paddingHorizontal: 6, justifyContent: "center" }}
                >
                  <Txt size={13} weight="semibold" color={colors.danger}>{t.deletePost}</Txt>
                </Pressable>
              )}
            </View>
          </Card>
        ))}
      </ScrollView>
    </Screen>
  );
}
