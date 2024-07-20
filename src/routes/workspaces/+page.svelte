<script lang="ts">
	import { onMount } from 'svelte';
	import * as Card from '$lib/components/ui/card';
	import * as Avatar from '$lib/components/ui/avatar';
	import { dbApiCall } from '$lib/utils';

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
	<h1 class="mb-4 text-2xl font-bold">Workspaces</h1>
	<div>
		<div class="w-11/12 mx-auto">
			<div class="flex flex-wrap gap-4 w-full">
				{#each workspaces as workspace}
					<a
						href="/workspaces/{workspace.id}"
						class="min-w-80 max-w-96 grow rounded-lg border-4 border-secondary bg-card p-1 text-card-foreground shadow-sm transition-all hover:cursor-pointer hover:border-8 hover:p-0 active:bg-slate-900"
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
</div>
