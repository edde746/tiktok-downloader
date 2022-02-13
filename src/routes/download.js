import { getClient } from "$lib/redis";
import { randomBytes } from "crypto";

// Proxy the file
export const get = async ({ url }) => {
  // Get video information
  const client = await getClient();
  const fileUrl = await client.get(url.searchParams.get("id").toString());
  await client.disconnect();
  if (!fileUrl) return { status: 500, body: "Something went wrong" };

  const video = await fetch(fileUrl).then((res) => res.arrayBuffer());
  return {
    body: new Uint8Array(video),
    headers: {
      "content-type": "video/mp4",
      "Content-disposition": `attachment; filename=tikdown.xyz-${randomBytes(8).toString("hex")}.mp4`,
    },
  };
};
