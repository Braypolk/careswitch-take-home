<script lang="ts">
	import { createTable, Render, Subscribe, createRender } from 'svelte-headless-table';
	import {
		addPagination,
		addSortBy,
		addTableFilter,
		addSelectedRows,
		addHiddenColumns
	} from 'svelte-headless-table/plugins';
	import ArrowUpDown from 'lucide-svelte/icons/arrow-up-down';
	import ArrowUp from 'lucide-svelte/icons/arrow-up';
	import ArrowDown from 'lucide-svelte/icons/arrow-down';
	import { readable } from 'svelte/store';
	import * as Table from '$lib/components/ui/table';
	import { Button } from '$lib/components/ui/button';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import * as Select from '$lib/components/ui/select';

	import DataTableActions from '$lib/components/data-table/data-table-actions.svelte';
	import DataTableCheckbox from '$lib/components/data-table/data-table-checkbox.svelte';
	import type { User } from '@prisma/client';

	let {
		data = [],
		selectable = false,
		hover = true,
		filterValueProp,
		selectedUsers = $bindable(),
		selectedUserId = $bindable()
	} = $props<{
		data: [];
		selectable?: boolean;
		hover?: boolean;
		filterValueProp: string;
		selectedUsers?: string[];
		selectedUserId?: string;
	}>();

	const sizes = [3, 5, 10, 25];
	let selected = $state({ value: 3, label: '3' });

	const table = createTable(readable(data), {
		page: addPagination({ initialPageSize: 3 }),
		sort: addSortBy(),
		filter: addTableFilter({
			fn: ({ filterValue, value }) => value.toLowerCase().includes(filterValue.toLowerCase())
		}),
		select: addSelectedRows(),
		hide: addHiddenColumns()
	});

	const columns = table.createColumns([
		table.column({
			accessor: 'id',
			header: (_, { pluginStates }) => {
				const { allPageRowsSelected } = pluginStates.select;
				return createRender(DataTableCheckbox, {
					checked: allPageRowsSelected
				});
			},
			cell: ({ row }, { pluginStates }) => {
				const { getRowState } = pluginStates.select;
				const { isSelected } = getRowState(row);

				return createRender(DataTableCheckbox, {
					checked: isSelected
				});
			},
			plugins: {
				sort: {
					disable: true
				},
				filter: {
					exclude: true
				}
			}
		}),
		table.column({
			accessor: 'firstName',
			header: 'First Names'
		}),
		table.column({
			accessor: 'lastName',
			header: 'Last Name'
		}),
		table.column({
			accessor: 'email',
			header: 'Email',
			filter: {
				exclude: true
			}
		}),
		table.column({
			accessor: ({ id, email }) => ({ id, email }),
			header: '',
			id: 'actions',
			filter: {
				exclude: true
			},
			cell: ({ value }) => {
				return createRender(DataTableActions, { id: value.id, email: value.email });
			}
		})
	]);

	const { flatColumns, headerRows, pageRows, tableAttrs, tableBodyAttrs, pluginStates, rows } =
		table.createViewModel(columns, { rowDataId: (item) => item.id });
	const { hasNextPage, hasPreviousPage, pageIndex, pageSize } = pluginStates.page;
	const { filterValue } = pluginStates.filter;
	const { selectedDataIds } = pluginStates.select;
	const { sortKeys } = pluginStates.sort;
	const { hiddenColumnIds } = pluginStates.hide;		

	$sortKeys = [
		{
			id: 'firstName',
			order: 'asc'
		}
	];

	selectedUserId = $pageRows[0].dataId;

	$effect(() => {
		$hiddenColumnIds = [selectable ? '' : 'id'];
	});
	$effect(() => {
		$pageSize = selected.value;
	});
	$effect(() => {
		selectedUsers = Object.keys($selectedDataIds);
	});
	$effect(() => {
		$filterValue = filterValueProp;
	});
</script>

<div>
	<div class="rounded-md border">
		<Table.Root {...$tableAttrs}>
			<Table.Header>
				{#each $headerRows as headerRow}
					<Subscribe rowAttrs={headerRow.attrs()}>
						<Table.Row>
							{#each headerRow.cells as cell (cell.id)}
								<Subscribe attrs={cell.attrs()} let:attrs props={cell.props()} let:props>
									<Table.Head {...attrs}>
										{#if cell.id === 'id' || cell.id === ''}
											<Render of={cell.render()} />
										{:else}
											<Button class="px-0" variant="ghost" on:click={props.sort.toggle}>
												<Render of={cell.render()} />
												{#if props.sort.order === 'asc'}
													<Tooltip.Root>
														<Tooltip.Trigger><ArrowUp class={'ml-2 h-4 w-4'} /></Tooltip.Trigger>
														<Tooltip.Content>ascending</Tooltip.Content>
													</Tooltip.Root>
												{:else if props.sort.order === 'desc'}
													<Tooltip.Root>
														<Tooltip.Trigger><ArrowDown class={'ml-2 h-4 w-4'} /></Tooltip.Trigger>
														<Tooltip.Content>descending</Tooltip.Content>
													</Tooltip.Root>
												{:else}
													<Tooltip.Root>
														<Tooltip.Trigger><ArrowUpDown class={'ml-2 h-4 w-4'} /></Tooltip.Trigger
														>
														<Tooltip.Content>click to sort</Tooltip.Content>
													</Tooltip.Root>
												{/if}
											</Button>
										{/if}
									</Table.Head>
								</Subscribe>
							{/each}
						</Table.Row>
					</Subscribe>
				{/each}
			</Table.Header>
			<Table.Body {...$tableBodyAttrs}>
				{#each $pageRows as row (row.id)}
					<Subscribe rowAttrs={row.attrs()} let:rowAttrs>
						<Table.Row
							{...rowAttrs}
							data-state={'selected'}
							on:click={(e) => e.target.tagName === 'TD' && (selectedUserId = row.dataId)}
							class={hover &&
								`${hover && 'cursor-pointer hover:!bg-muted-foreground'} ${selectedUserId === row.dataId && '!bg-muted-foreground'} `}
						>
							{#each row.cells as cell (cell.id)}
								<Subscribe attrs={cell.attrs()} let:attrs>
									<Table.Cell {...attrs}>
										<Render of={cell.render()} />
									</Table.Cell>
								</Subscribe>
							{/each}
						</Table.Row>
					</Subscribe>
				{/each}
			</Table.Body>
		</Table.Root>
	</div>

	<div class="flex items-center justify-between space-x-4 py-4">
		<Select.Root bind:selected>
			<Select.Trigger class="w-16">
				<Select.Value />
			</Select.Trigger>
			<Select.Content>
				<Select.Group>
					{#each sizes as size}
						<Select.Item value={size} label={size}>{size}</Select.Item>
					{/each}
				</Select.Group>
			</Select.Content>
			<Select.Input name="favoriteFruit" />
		</Select.Root>
		<div>
			<Button
				variant="outline"
				size="sm"
				on:click={() => ($pageIndex = $pageIndex - 1)}
				disabled={!$hasPreviousPage}>Previous</Button
			>
			<Button
				variant="outline"
				size="sm"
				disabled={!$hasNextPage}
				on:click={() => ($pageIndex = $pageIndex + 1)}>Next</Button
			>
		</div>
	</div>
</div>
