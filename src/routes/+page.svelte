<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { dbApiCall } from '$lib/utils';
	import { onMount } from 'svelte';

	let workspaces = [];
	let users = [];

	onMount(async () => {
		await fetchWorkspaces();
		await fetchUsers();
	});

	async function fetchWorkspaces() {
		try {
			const res: [] | Error = await dbApiCall('/api/workspaces');
			workspaces = res;
		} catch (error) {
			console.log(error);
		}
	}

	async function fetchUsers() {
		try {
			const res: [] | Error = await dbApiCall('/api/users');
			users = res;
		} catch (error) {
			console.log(error);
		}
	}
</script>

<div class="container mx-auto p-4">
	<h1 class="mb-4 text-2xl font-bold">Careswitch User Management Interface</h1>

	<div class="mx-7 flex gap-7">
		<Button
			href="/users"
			class="total-users flex h-24 w-64 items-center justify-center rounded-lg"
			variant="secondary"
		>
			Total Users: {users.length}
		</Button>
		<Button
			href="/workspaces"
			class="total-workspaces flex h-24 w-64 items-center justify-center rounded-lg"
			variant="secondary"

		>
			Total Workspaces: {workspaces.length}
		</Button>
	</div>
</div>
