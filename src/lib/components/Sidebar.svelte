<script lang="ts">
	import { page } from '$app/stores';
	import { Button } from '$lib/components/ui/button';

	import User from 'lucide-svelte/icons/user';
	import CirclePlus from 'lucide-svelte/icons/circle-plus';
	import LibraryBig from 'lucide-svelte/icons/library-big';
	import ArrowRightToLine from 'lucide-svelte/icons/arrow-right-to-line';
	import ArrowLeftToLine from 'lucide-svelte/icons/arrow-left-to-line';

	let navActive = $state(false);
</script>

<nav class="h-screen bg-accent p-4 text-primary">
	<ul class="flex h-full flex-col gap-2">
		<li>
			{#if navActive}
				<div class="flex">
					<Button href="/" variant="ghost" class="mb-5 cursor-pointer text-2xl font-bold"
						>Careswitch</Button
					>
				</div>
			{:else}
				<Button href="/" variant="ghost" class="w-full p-0 mb-7 mt-2 cursor-pointer text-2xl font-bold">
					<svg
						class="mx-auto h-6 w-6 animate-rotate"
						viewBox="0 0 378 381"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							fill-rule="evenodd"
							clip-rule="evenodd"
							d="M378 190.5C378 295.71 292.71 381 187.5 381C95.479 381 18.6972 315.754 0.89231 229H74.1669C89.7774 274.943 133.278 308 184.5 308C248.841 308 301 255.841 301 191.5C301 127.159 248.841 75 184.5 75C133.651 75 90.4103 107.578 74.5118 153H0.68988C18.1079 65.7479 95.1258 0 187.5 0C292.71 0 378 85.2898 378 190.5Z"
							class="fill-primary"
						/>
					</svg>
				</Button>
			{/if}
		</li>
		<li>
			{#if navActive}
				<Button
					variant={$page.url.pathname === '/users' ? 'default' : 'ghost'}
					class="w-full justify-start"
					href="/users"
				>
					<User class="mr-2" />
					Users
				</Button>
			{:else}
				<Button
					variant={$page.url.pathname === '/users' ? 'default' : 'ghost'}
					class="justify-start px-2"
					href="/users"
				>
					<User class="mr" />
				</Button>
			{/if}
		</li>
		<li>
			{#if navActive}
				<Button
					variant={$page.url.pathname === '/workspaces' ? 'default' : 'ghost'}
					class="w-full justify-start"
					href="/workspaces"
				>
					<LibraryBig class="mr-2" />
					Workspaces
				</Button>
			{:else}
				<Button
					variant={$page.url.pathname === '/workspaces' ? 'default' : 'ghost'}
					class="justify-start px-2"
					href="/workspaces"
				>
					<LibraryBig class="mr" />
				</Button>
			{/if}
		</li>
		<li>
			{#if navActive}
				<Button
					variant={$page.url.pathname === '/create' ? 'default' : 'ghost'}
					class="w-full justify-start"
					href="/create"
				>
					<CirclePlus class="mr-2" />
					Create
				</Button>
			{:else}
				<Button
					variant={$page.url.pathname === '/create' ? 'default' : 'ghost'}
					class="justify-start px-2"
					href="/create"
				>
					<CirclePlus class="mr" />
				</Button>
			{/if}
		</li>
		<li class="flex grow justify-center">
			<Button
				variant="ghost"
				class="h-full w-full px-2 hover:bg-background/20"
				on:click={() => (navActive = !navActive)}
			>
				{#if navActive}
					<ArrowLeftToLine class="h-[1.2rem] w-[1.2rem]" />
				{:else}
					<ArrowRightToLine class="h-[1.2rem] w-[1.2rem]" />
				{/if}
			</Button>
		</li>
	</ul>
</nav>

<style>
	.animate-rotate:hover {
		transition: 1s;
		transition-timing-function: cubic-bezier(.27,1.53,.76,1.01);
		transform: rotate(360deg);
		-webkit-transform: rotate(360deg);
		-moz-transform: rotate(360deg);
		-o-transform: rotate(360deg);
		-ms-transform: rotate(360deg);
	}
</style>