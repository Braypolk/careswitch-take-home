import { PrismaClient } from '@prisma/client';

function generateTag(text) {
	const words = text.trim().split(/\s+/); // Split the text into words based on whitespace
	// If there is only one word, return the first two letters of that word otherwise return the first letter of the first two word
	if (words.length === 1) {
		return words[0].substring(0, 2);
	} else {
		return words[0][0] + words[1][0];
	}
}

const prisma = new PrismaClient();

async function createWorkspaces() {
	const workspace1 = await prisma.workspace.create({
		data: {
			name: 'Schrute Farms',
			tag: 'SF',
			description: 'The first workspace',
		},
	});

	const workspace2 = await prisma.workspace.create({
		data: {
			name: 'Scranton Branch',
			tag: 'SB',
			description: 'The second workspace',
		},
	});

	return [workspace1, workspace2];
}

async function createUsers() {
	const createdUsers = [];
	const firstNames = ['Dwight', 'Michael', 'Jim', 'Pam', 'Kelly'];
	const lastNames = ['Schrute', 'Scott', 'Halpert', 'Beasley', 'Kapoor'];
	const jobTitles = ['Manager', 'assistant to the regional manager', 'Sales', 'Sales', 'Customer service'];

	const users = [
		{ firstName: 'Dwight', lastName: 'Schrute', jobTitle: 'Assistant to the regional manager', vacationDays: 1 },
		{ firstName: 'Michael', lastName: 'Scott', jobTitle: 'Regional Manager', vacationDays: 20 },
		{ firstName: 'Jim', lastName: 'Halpert', jobTitle: 'Sales', vacationDays: 29 },
		{ firstName: 'Pam', lastName: 'Beasley', jobTitle: 'Receptionist', vacationDays: 20 },
		{ firstName: 'Kelly', lastName: 'Kapoor', jobTitle: 'Customer Service', vacationDays: 15 },
	]

	for (let i = 0; i < users.length; i++) {
		const createdUser = await prisma.user.create({
			data: {
				firstName: users[i].firstName,
				lastName: users[i].lastName,
				tag: generateTag(users[i].firstName + ' ' + users[i].lastName),
				email: `${users[i].firstName.toLowerCase()}.${users[i].lastName.toLowerCase()}@example.com`,
				startDate: new Date(Date.now() - Math.floor(Math.random() * (365 * 24 * 60 * 60 * 1000))),
				jobTitle: users[i].jobTitle,
				vacationDays: users[i].vacationDays,
			},
		});
		createdUsers.push(createdUser);
	}
	return createdUsers;
}

async function assignUsersToWorkspaces() {
	const [workspace1, workspace2] = await createWorkspaces();
	const users = await createUsers();

	// add dwight to both workspaces
	await prisma.workspacesOnUsers.create({
		data: {
			userId: users[0].id,
			workspaceId: workspace1.id,
		},
	});

	for (let i = 0; i < 4; i++) {
		await prisma.workspacesOnUsers.create({
			data: {
				userId: users[i].id,
				workspaceId: workspace2.id,
			},
		});
	}
}

async function main() {
	await assignUsersToWorkspaces();
	console.log('Users and workspaces have been setup');
}

main()
	.catch(e => {
		throw e;
	})
	.finally(async () => {
		await prisma.$disconnect();
	});