<script>
	import { onMount } from 'svelte';
	export let name;


	onMount(async () => {
		console.log('[hydritsi] App mounted!');
	});
</script>

<main>
	<h1>Hello {name}! HYDRITSI</h1>
</main>

<style>
</style>