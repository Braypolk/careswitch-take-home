<script lang="ts">
	import { onMount } from 'svelte';
	import * as Card from '$lib/components/ui/card';
	import * as Avatar from '$lib/components/ui/avatar';

	let workspaces = $state([]);
	let selectedWorkspace = $state();
	let users = [];
	let selectedUsers = new Set();
	let displayError = false;
	let displaySuccess = false;

	let messageType = 'success';
	let message = 'Workspaces deleted';

	onMount(async () => {
		await fetchWorkspaces();
		await fetchUsers();
	});

	async function fetchWorkspaces() {
		try {
			const response = await fetch('/api/workspaces');
			workspaces = await response.json();
		} catch (error) {
			displayError = true;
		}
	}

	async function fetchUsers() {
		try {
			const response = await fetch('/api/users');
			users = await response.json();
		} catch (error) {
			displayError = true;
			messageType = 'Error';
			message = 'Failed to fetch users';
		}
	}

	async function fetchWorkspaceDetails(workspaceId) {
		try {
			const response = await fetch(`/api/workspaces/${workspaceId}`);
			selectedWorkspace = await response.json();
		} catch (error) {
			displayError = true;
			messageType = 'Error';
			message = 'Failed to fetch workspace details';
		}
	}

	async function addUsers() {
		if (selectedWorkspaces.size === 0 || selectedUsers.size === 0) {
			displayError = true;
			messageType = 'Error';
			message = 'Please select at least one workspace and one user';
			return;
		}

		try {
			for (const workspaceId of selectedWorkspaces) {
				for (const userId of selectedUsers) {
					await fetch(`/api/workspaces/${workspaceId}/users`, {
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({ userId })
					});
				}
			}
			displaySuccess = true;
			messageType = 'Success';
			message = 'Users added to workspaces';

			selectedWorkspaces.clear();
			selectedUsers.clear();
			selectedWorkspaces = selectedWorkspaces;
			selectedUsers = selectedUsers;
		} catch (error) {
			displayError = true;
			messageType = 'Error';
			message = 'Failed to add users to workspaces';
		}
	}

	async function deleteWorkspaces() {
		if (selectedWorkspaces.size === 0) {
			displayError = true;
			messageType = 'Error';
			message = 'Please select at least one workspace';
			clearMessage();
			return;
		}

		try {
			for (const workspaceId of selectedWorkspaces) {
				await fetch(`/api/workspaces/${workspaceId}`, { method: 'DELETE' });
			}
			displaySuccess = true;
			messageType = 'Success';
			message = 'Workspaces deleted';

			await fetchWorkspaces();
			selectedWorkspaces.clear();
			selectedWorkspaces = selectedWorkspaces;
		} catch (error) {
			displayError = true;
			messageType = 'Error';
			message = 'Failed to delete workspaces';
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

<div class="container mx-auto p-4">
	<h1 class="mb-4 text-2xl font-bold">Workspaces</h1>
	<div>
		<div class="flex flex-wrap gap-4">
			{#each workspaces as workspace}
				<a
					href="/workspaces/{workspace.id}"
					class="min-w-64 max-w-96 grow rounded-lg border-4 border-secondary bg-card p-1 text-card-foreground shadow-sm transition-all hover:cursor-pointer hover:border-8 hover:p-0 active:bg-slate-900"
				>
					<Card.Header class="flex flex-row">
						<Avatar.Root>
							<Avatar.Fallback>{workspace.tag}</Avatar.Fallback>
						</Avatar.Root>
						<div class="ml-4">
							<Card.Title class="shrink">{workspace.name}</Card.Title>
							<Card.Description>{workspace.description}</Card.Description>
						</div>
					</Card.Header>
					<Card.Content>
						<p>Total Users: {workspace._count.users}</p>
					</Card.Content>
				</a>
			{/each}
		</div>
	</div>
</div>
