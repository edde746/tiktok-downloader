<script context="module">
  export function load({ error, status }) {
    if (status == 405) return { status: 302, redirect: "/" };
    return { props: { error: error.message } };
  }
</script>

<script>
  export let error;
</script>

{error}
