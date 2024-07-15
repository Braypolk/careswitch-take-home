<script>
	import { ModeWatcher } from 'mode-watcher';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import '../app.css';

	let { children } = $props();
</script>

<ModeWatcher />
<div class="flex">
	<Sidebar />
	<main class="flex-1">
		{@render children()}
    </main>
</div>

