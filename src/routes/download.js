import { randomBytes } from "crypto";

// Proxy the file
export const get = async ({ url }) => {
  // Get video information
  const tiktok = await fetch(
    `http://api2.musical.ly/aweme/v1/aweme/detail/?aweme_id=${url.searchParams.get("id")}`
  ).then((res) => res.json());

  // Get video
  const downloadUrl = tiktok?.aweme_detail?.video?.play_addr?.url_list[0];
  const video = await fetch(downloadUrl).then((res) => res.arrayBuffer());

  return {
    body: new Uint8Array(video),
    headers: {
      "content-type": "video/mp4",
      "Content-disposition": `attachment; filename=tikdown.xyz-${randomBytes(8).toString("hex")}.mp4`,
    },
  };
};
