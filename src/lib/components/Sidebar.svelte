<script lang="ts">
	import { page } from '$app/stores';
	import { Button } from '$lib/components/ui/button';
	import { toggleMode } from 'mode-watcher';

	import Sun from 'lucide-svelte/icons/sun';
	import Moon from 'lucide-svelte/icons/moon';
</script>

<!-- --accent
    --secondary
    --primary
    --card -->
<nav class="h-screen w-64 bg-accent p-4 text-primary">
	<div class="flex justify-between mb-5">
		<h1 class="mb-4 text-2xl font-bold">Careswitch</h1>
		<Button on:click={toggleMode} variant="outline" size="icon">
			<Sun
				class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
			/>
			<Moon
				class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
			/>
			<span class="sr-only">Toggle theme</span>
		</Button>
	</div>
	<ul class="space-y-2">
		<li>
			<Button
				variant={$page.url.pathname === '/users' ? 'default' : 'ghost'}
				class="w-full justify-start"
				href="/users"
			>
				Users
			</Button>
		</li>
		<li>
			<Button
				variant={$page.url.pathname === '/workspaces' ? 'default' : 'ghost'}
				class="w-full justify-start"
				href="/workspaces"
			>
				Workspaces
			</Button>
		</li>
		<li>
			<Button
				variant={$page.url.pathname === '/create' ? 'default' : 'ghost'}
				class="w-full justify-start"
				href="/create"
			>
				Create
			</Button>
		</li>
	</ul>
</nav>
