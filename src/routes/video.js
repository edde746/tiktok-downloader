import { getClient } from "$lib/redis";

export const post = async ({ request }) => {
  const body = await request.formData();

  // Validate URL
  if (!body.has("url") || !body.get("url").length) return { status: 400, body: { error: "No video provided" } };
  if (!["vm.tiktok.com", "tiktok.com", "www.tiktok.com"].includes(new URL(body.get("url")).hostname))
    return { status: 400, body: { error: "Forbidden domain" } };

  const id = await (async () => {
    // Check for video ID in url
    // https://www.tiktok.com/@username/video/{{videoId}}
    let idInUrl = body.get("url").match(/video\/([0-9]+)/);
    if (idInUrl) return idInUrl[1];

    // ID not found in url, attempt to get redirect url video ID
    const share = await fetch(body.get("url"), { redirect: "manual" });
    if (!share.headers.has("location")) return null;
    return share.headers.get("location").match(/([0-9])\w+/)[0];
  })();

  if (!id) return { status: 500, body: { error: "Could not find video ID" } };

  const client = await getClient();
  // Get video information
  let tiktok = await fetch(`http://api2.musical.ly/aweme/v1/aweme/detail/?aweme_id=${id}`, {
    headers: { Cookie: (await client.get("cookies")) || "" },
  }).then(async (res) => {
    const newCookies = res.headers.get("set-cookie");
    if (newCookies) await client.set("cookies", newCookies);
    return res.json();
  });

  await client.set(id.toString(), tiktok?.aweme_detail?.video?.play_addr?.url_list[0]);
  await client.expire(id.toString(), 60 * 60);
  await client.disconnect();

  if (!tiktok?.aweme_detail?.video) return { status: 400, body: { error: "Could not fetch details" } };
  else tiktok = tiktok.aweme_detail;

  // Return data
  return {
    body: {
      video: {
        id: id, //tiktok.video.play_addr.url_list[0],
        cover: tiktok.video.ai_dynamic_cover.url_list[0],
        posted: tiktok.create_time,
        author: {
          name: tiktok.author.unique_id,
          avatar: tiktok.author.avatar_300x300.url_list[0],
        },
      },
    },
  };
};
