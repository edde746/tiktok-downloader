export const post = async ({ request }) => {
    const body = await request.json();

    const id = await (async () => {
        // Check for video ID in url
        // https://www.tiktok.com/@username/video/{{videoId}}
        let idInUrl = body.url.match(/video\/([0-9]+)/);
        if (idInUrl)
            return idInUrl[1];

        // ID not found in url, attempt to get redirect url video ID
        const share = await fetch(body.url, { redirect: "manual" });
        return share.headers.get('location').match(/([0-9])\w+/)[0];
    })();

    // Get video information
    let tiktok = await fetch(`http://api2.musical.ly/aweme/v1/aweme/detail/?aweme_id=${id}`).then((res) => res.json());
    if (!tiktok?.aweme_detail?.video)
        return { status: 400, body: { 'error': 'Could not fetch details' } }
    else
        tiktok = tiktok.aweme_detail;

    // Return data
    return {
        body: {
            cover: tiktok.video.ai_dynamic_cover.url_list[0],
            file: tiktok.video.play_addr.url_list[0],
            posted: tiktok.create_time,
            author: {
                name: tiktok.author.unique_id,
                avatar: tiktok.author.avatar_300x300.url_list[0]
            }
        }
    }
}