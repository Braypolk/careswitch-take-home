<script lang="ts">
	import { onMount } from 'svelte';
	import { Button } from '$lib/components/ui/button';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import { Input } from '$lib/components/ui/input';
	import {
		Table,
		TableBody,
		TableCell,
		TableHead,
		TableHeader,
		TableRow
	} from '$lib/components/ui/table';
	import {
		Card,
		CardContent,
		CardDescription,
		CardFooter,
		CardHeader,
		CardTitle
	} from '$lib/components/ui/card';
	import Message from '$lib/components/ui/Message.svelte';
	import DataTable from '../data-table.svelte';
	import * as Select from '$lib/components/ui/select';

	let users: [] = $state([]);
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
	let workspaces = $state([]);
	let selectedWorkspace = $state('');

	// todo make this a component
	let displayError = false;
	let displaySuccess = false;

	let messageType = 'success';
	let message = 'Workspaces deleted';
	let isLoading = $state(true);

	onMount(async () => {
		await fetchUsers();
		await fetchWorkspaces();
	});

	$effect(() => {
		console.log(selectedUsers.length);
	});

	async function fetchUsers() {
		try {
			const response = await fetch('/api/users');
			users = await response.json();
			isLoading = false;
			console.log(users, isLoading);
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
</script>

<!-- {#if displaySuccess}
	<Message {messageType} {message} />
{/if}
{#if displayError}
	<Message {messageType} {message} />
{/if} -->

<div class="container mx-auto p-4">
	<h1 class="mb-4 text-2xl font-bold">Users</h1>

	<div class="grid grid-cols-3 gap-4 transition-all">
		<div class={selectedUserId ? 'col-span-2 transition-all' : 'col-span-3 transition-all'}>
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

		<div>
			{#if selectedUser}
				<Card>
					<CardHeader>
						<CardTitle class="text-3xl">{selectedUser.firstName} {selectedUser.lastName}</CardTitle>
						<CardDescription
							onclick={() => {
								console.log('# todo: copy to clip board');
							}}>{selectedUser.email}</CardDescription
						>
					</CardHeader>
					<CardContent>
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
					</CardContent>
				</Card>
			{/if}
		</div>
	</div>
</div>
<!-- <div class="absolute right-0 top-0 h-full w-64 bg-gray-100 text-black">
	<h1></h1>
</div> -->
