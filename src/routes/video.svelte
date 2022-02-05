<script>
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";

  export let video;
  export let error;

  onMount(() => {
    if (!video && !error) {
      goto("/");
    }
  });
</script>

{#if error}
  <div class="flex gap-1 items-center flex-col">
    <h1 class="text-xl">⚠</h1>
    <p>{error}</p>
  </div>
{:else if video}
  <div class="flex gap-3 items-center">
    <img src={video.cover} alt="Video Cover" class="aspect-square object-cover rounded-md h-40" />
    <div class="grid gap-3">
      <div>
        <h3 class="text-lg font-semibold">Author</h3>
        <div class="flex gap-2 items-center">
          <img src={video.author.avatar} class="h-6 w-6 rounded-full" alt="Avatar" />
          <p>@{video.author.name}</p>
        </div>
      </div>
      <div>
        <h3 class="text-lg font-semibold">Created</h3>
        <p>{new Date(video.posted * 1000).toDateString()}</p>
      </div>
      <a href={`/download?id=${video.id}`} download class="btn bg-sky-100 text-sky-700 hover:bg-sky-200 text-center">Download</a>
    </div>
  </div>
{/if}
