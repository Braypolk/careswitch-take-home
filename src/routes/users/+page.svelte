<script lang="ts">
	import { onMount } from 'svelte';

	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Skeleton } from '$lib/components/ui/skeleton/index.js';
	import * as Card from '$lib/components/ui/card';
	import * as Select from '$lib/components/ui/select';
	import * as Collapsible from '$lib/components/ui/collapsible';
	import * as Avatar from '$lib/components/ui/avatar';
	
	import DataTable from '$lib/components/data-table/data-table.svelte';

	import ChevronDown from 'lucide-svelte/icons/chevron-down';
	import ChevronUp from 'lucide-svelte/icons/chevron-up';
	import Maximize2 from 'lucide-svelte/icons/maximize-2';


	let users: [] = $state([]);
	let workspaces = $state([]);
	let selectedWorkspace = $state('');

	let filterValueProp = $state('');
	let selectedUsers = $state([]);
	let selectedUserId = $state('');
	let selectedUser = $derived.by(() => {
		for (let i = 0; i < users.length; i++) {
			if (users[i].id === selectedUserId) {
				return users[i];
			}
		}
	});
	let infoOpen = $state(true);
	// todo make this a component
	let displayError = false;
	let displaySuccess = false;

	let messageType = 'success';
	let message = 'Workspaces deleted';
	let isLoading = $state(true);

	onMount(async () => {
		await fetchUsers();
		infoOpen = selectedUser ? true : false;
		await fetchWorkspaces();
	});

	async function fetchUsers() {
		try {
			const resUsers = await fetch('/api/users');
			const resUsersJson: [] = await resUsers.json();
			if (resUsersJson !== undefined) {
				users = resUsersJson;
				if (resUsersJson.length > 0) {
					selectedUserId = resUsersJson[0].id;
				}
			} else {
				users = [];
			}
			isLoading = false;
		} catch (error) {
			displayError = true;
			messageType = 'Error';
			message = 'Failed to fetch users';
			isLoading = false;
		}
	}

	async function fetchWorkspaces() {
		try {
			const response = await fetch('/api/workspaces');
			workspaces = await response.json();
		} catch (error) {
			displayError = true;
			messageType = 'Error';
			message = 'Failed to fetch workspaces';
		}
	}

	// async function fetchUserDetails(userId) {
	// 	try {
	// 		const response = await fetch(`/api/users/${userId}`);
	// 		selectedUser = await response.json();
	// 	} catch (error) {
	// 		displayError = true;
	// 		messageType = 'Error';
	// 		message = 'Failed to fetch user details';
	// 	}
	// }

	async function addToWorkspace() {
		if (!selectedWorkspace || selectedUsers.size === 0) {
			displayError = true;
			messageType = 'Error';
			message = 'Please select a workspace and at least one user';
			return;
		}

		try {
			for (const userId of selectedUsers) {
				await fetch(`/api/workspaces/${selectedWorkspace}/users`, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ userId })
				});
			}
			displayError = true;
			messageType = 'Success';
			message = 'Users added to workspace';

			selectedUsers.clear();
			selectedUsers = selectedUsers;
		} catch (error) {
			displayError = true;
			messageType = 'Error';
			message = 'Failed to add users to workspace';
		}
	}

	async function deleteUsers() {
		if (selectedUsers.size === 0) {
			displayError = true;
			messageType = 'Error';
			message = 'Please select at least one user';
			return;
		}

		try {
			for (const userId of selectedUsers) {
				await fetch(`/api/users/${userId}`, { method: 'DELETE' });
			}
			displayError = true;
			messageType = 'Success';
			message = 'Users deleted';

			await fetchUsers();
			selectedUsers.clear();
			selectedUsers = selectedUsers;
		} catch (error) {
			displayError = true;
			messageType = 'Error';
			message = 'Failed to delete users';
		}
	}

	function clearMessage() {
		setTimeout(() => {
			if (displayError) {
				displayError = false;
			} else if (displaySuccess) {
				displaySuccess = false;
			}
		}, 5000);
	}

	function generateAltTag(text: string): string {
		const words = text.trim().split(/\s+/); // Split the text into words based on whitespace
		// If there is only one word, return the first two letters of that word otherwise return the first letter of the first two word
		if (words.length === 1) {
			return words[0].substring(0, 2);
		} else {
			return words[0][0] + words[1][0];
		}
	}
</script>

<!-- {#if displaySuccess}
	<Message {messageType} {message} />
{/if}
{#if displayError}
	<Message {messageType} {message} />
{/if} -->

<div class="container mx-auto p-4">
	<h1 class="mb-4 text-2xl font-bold">Users</h1>
	<Collapsible.Root bind:open={infoOpen}>
		<Collapsible.Trigger class="block h-8 w-full rounded-t-lg bg-secondary">
			<!-- <p>test</p> -->
			{#if infoOpen}
				<ChevronDown class="mx-auto" />
			{:else}
				<ChevronUp class="mx-auto" />
			{/if}
		</Collapsible.Trigger>
		{#if isLoading}
			<Collapsible.Content>
				<Card.Root class="h-60 overflow-y-scroll  rounded-t-none">
					<Card.Header class="flex flex-row gap-3">
						<Skeleton class="my-auto h-12 w-12 rounded-full" />
						<div>
							<Skeleton class="mb-1 h-9 w-64" />
							<Skeleton class="h-5 w-64" />
						</div>
					</Card.Header>
					<Card.Content>
						<Skeleton class="mb-1 h-6 w-64" />
						<Skeleton class="mb-6 h-6 w-64" />
						<Skeleton class="mb-1 h-6 w-64" />
						<Skeleton class="mb-6 h-6 w-64" />
						<Skeleton class="mb-1 h-6 w-64" />
						<Skeleton class="mb-6 h-6 w-64" />
					</Card.Content>
				</Card.Root>
			</Collapsible.Content>
		{:else}
			<Collapsible.Content>
				<Card.Root class="h-60 overflow-scroll rounded-t-none">
					<Card.Header>
						<div class="flex justify-between">
							<div class="flex gap-3">
								<Avatar.Root class="my-auto h-12 w-12">
									<Avatar.Fallback
										>{generateAltTag(
											selectedUser.firstName + ' ' + selectedUser.lastName
										)}</Avatar.Fallback
									>
								</Avatar.Root>
								<div>
									<Card.Title class="text-3xl"
										>{selectedUser.firstName} {selectedUser.lastName}</Card.Title
									>
									<Card.Description
										onclick={() => {
											console.log('# todo: copy to clip board');
										}}>{selectedUser.email}</Card.Description
									>
								</div>
							</div>
							<Button variant="ghost" class="h-9 w-9 px-2 py-2" href="/users/{selectedUser.id}"
								><Maximize2 class="h-full w-full" /></Button
							>
						</div>
					</Card.Header>
					<Card.Content>
						<p class="text-muted-foreground">id:</p>
						<p class="pb-6">{selectedUser.id}</p>
						<p class="text-muted-foreground">Start Date:</p>
						<p class="pb-6">{selectedUser.startDate}</p>
						<p class="text-muted-foreground">Job Title:</p>
						<p class="pb-6">{selectedUser.jobTitle}</p>
						<p class="text-muted-foreground">Vacation Days:</p>
						<p class="pb-6">{selectedUser.vactionDays}</p>
						<h3 class="text-2xl font-semibold text-muted-foreground">Workspaces:</h3>
						<ul>
							{#each selectedUser.workspaces as workspace}
								<li>{workspace.name}</li>
							{/each}
						</ul>
					</Card.Content>
				</Card.Root>
			</Collapsible.Content>
		{/if}
	</Collapsible.Root>

	<div>
		{#if isLoading}
			<p>Loading...</p>
		{:else}
			<div class="flex items-center justify-between py-4">
				<Input
					class="max-w-sm"
					placeholder="Filter by Name..."
					type="text"
					bind:value={filterValueProp}
				/>
				<!-- set the id of the selected workspace -->
				<Select.Root onSelectedChange={(e) => e && (selectedWorkspace = e?.value)}>
					<Select.Trigger class="min-w-40 max-w-48">
						<Select.Value placeholder="Filter by Workspace" />
					</Select.Trigger>
					<Select.Content>
						<Select.Item value={''}>Filter by Workspace</Select.Item>
						<Select.Separator />
						{#each workspaces as workspace}
							<Select.Item value={workspace.id}>{workspace.name}</Select.Item>
						{/each}
					</Select.Content>
				</Select.Root>
			</div>
			<DataTable data={users} {filterValueProp} bind:selectedUsers bind:selectedUserId />
		{/if}

		{#if selectedUsers.length > 0}
			<div class="mt-4 space-x-2">
				<Button on:click={addToWorkspace}>Add to Workspace</Button>
				<Button variant="destructive" on:click={deleteUsers}>Delete Selected</Button>
			</div>
		{/if}
	</div>
</div>
