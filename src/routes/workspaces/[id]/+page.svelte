<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import ArrowLeft from 'lucide-svelte/icons/arrow-left';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import DataTable from '$lib/components/data-table/data-table.svelte';
	import { Input } from '$lib/components/ui/input';
	import * as Avatar from '$lib/components/ui/avatar';

	let workspace = $state({});
	let users: [] = $state([]);
	let currentNumberOfUsers = $state(0);
	let addUserTabActive = $state(false);
	let isLoading = $state(true);
	let displayError = $state(false);
	let filterValueProp = $state('');
	let selectedUsers = $state([]);

	onMount(async () => {
		await fetchWorkspaces();
	});

	async function getUsersNotInWorkspace(workspaceId: string) {
		try {
			const resUsers = await fetch(`/api/workspaces/${$page.params.id}/not-users`);
			const resUsersJson = await resUsers.json();
			users = resUsersJson;
			isLoading = false;
		} catch (error) {
			displayError = true;
			isLoading = false;
		}
	}

	async function fetchWorkspaces() {
		try {
			// return workspace information along with users assigned to the workspace
			const resWorkspace = await fetch(`/api/workspaces/${$page.params.id}`);
			const resWorkspaceJson = await resWorkspace.json();

			const resUsers = await fetch(`/api/workspaces/${$page.params.id}/users`);
			const resUsersJson = await resUsers.json();

			workspace = resWorkspaceJson;
			users = resUsersJson;
			currentNumberOfUsers = users.length; // User
			isLoading = false;
		} catch (error) {
			displayError = true;
			isLoading = false;
		}
	}
</script>

<div class="container mx-auto p-4">
	<div class="flex">
		<div>
			<a
				class="inline-flex items-center justify-center whitespace-nowrap rounded-md bg-accent px-2 py-1 align-text-top text-secondary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
				href="/workspaces"><ArrowLeft /></a
			>
		</div>
		<Avatar.Root class="ml-4">
			<Avatar.Fallback>{workspace.tag}</Avatar.Fallback>
		</Avatar.Root>
		<div class="ml-2 inline-block align-top">
			<h1 class="text-2xl font-bold">{workspace.name}</h1>
			<p class="text-muted-foreground">{workspace.description}</p>
		</div>
	</div>

	<div class="mt-8">
		<div class="flex gap-1 border-b border-secondary">
			<button
				onclick={() => {
					isLoading = true;
					addUserTabActive = false;
					fetchWorkspaces();
				}}
				class={!addUserTabActive
					? 'grow-[2] cursor-pointer border-b border-accent-foreground py-3 text-center transition-all'
					: 'grow-[2] cursor-pointer py-3 text-center transition-all hover:border-b-2 hover:border-accent hover:pb-[.625rem]'}
				>Users ({currentNumberOfUsers})</button
			>
			<button
				onclick={() => {
					isLoading = true;
					addUserTabActive = true;
					getUsersNotInWorkspace($page.params.id);
				}}
				class={addUserTabActive
					? 'grow cursor-pointer border-b border-accent-foreground py-3 text-center transition-all'
					: 'grow cursor-pointer py-3 text-center transition-all hover:border-b-2 hover:border-accent hover:pb-[.625rem]'}
				>Add Users</button
			>
		</div>
		<div class="flex">
			<Input
				class="my-4 grow"
				placeholder="Filter by Name..."
				type="text"
				bind:value={filterValueProp}
			/>
			{#if addUserTabActive}
				{#if selectedUsers.length > 0}
					<div class="mt-4 grow-0 space-x-2">
						<Button on:click={console.log('add')}>Add to Workspace</Button>
					</div>
				{/if}
			{:else if selectedUsers.length > 0}
				<div class="mt-4 grow-0 space-x-2">
					<Button variant="destructive" on:click={console.log('delete')}>Remove Selected</Button>
				</div>
			{/if}
		</div>
		{#if !isLoading}
			<DataTable data={users} {filterValueProp} hover={false} selectable={true} />
		{/if}
	</div>
</div>
