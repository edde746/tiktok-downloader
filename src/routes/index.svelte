<script>
  let url;
  let content;
</script>

<input bind:value={url} />
<button
  on:click={async () => {
    content = await fetch("/download", {
      method: "POST",
      body: JSON.stringify({
        url,
      }),
      headers: {
        "content-type": "application/json",
      },
    }).then((res) => res.text());
  }}>Download</button
>

<pre>{JSON.stringify({
    url,
  })}</pre>
<pre>{content}</pre>
