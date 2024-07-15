<script lang="ts">
	import Ellipsis from 'lucide-svelte/icons/ellipsis';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { Button } from '$lib/components/ui/button';

	export let id: string;
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger asChild let:builder>
		<Button variant="ghost" builders={[builder]} size="icon" class="relative h-8 w-8 p-0">
			<span class="sr-only">Open menu</span>
			<Ellipsis class="h-4 w-4" />
		</Button>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content>
		<DropdownMenu.Group>
			<DropdownMenu.Item on:click={() => navigator.clipboard.writeText(id)}>
				Copy ID
			</DropdownMenu.Item>
		</DropdownMenu.Group>
		<DropdownMenu.Item>View User Details</DropdownMenu.Item>
		<DropdownMenu.Item>Edit User Details</DropdownMenu.Item>
		<DropdownMenu.Separator />
		<DropdownMenu.Item class="text-red-600 hover:!bg-red-500">Delete User</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>
