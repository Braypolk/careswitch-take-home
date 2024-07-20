# Careswitch User Management Interface

## Overview

This repository is for the Careswitch User Management Interface coding assignment, a simple web application designed for managing users and their associations with workspaces. The project utilizes Sveltekit, Tailwind, Shadcn-svelte, Zod, Superforms, and Prisma. All forms are build with Superforms and Zod.

## Features

### Pages

- Home Page (localhost:3000/): Displays the main dashboard where users can see the total count of users and workspaces
- User List (localhost:3000/users): Displays paginated view of all users, and details of a selected user. Users are searchable by first and last name. Users can be sorted by first name, last name, and email.
- Workspace List (localhost:3000/workspaces): Displays all workspaces and the number of users in each workspace.
- User Details (localhost:3000/users/[id]): Displays larger more readable view of user info. Allows user to be edited and deleted
- Workspace Details (localhost:3000/workspaces[id]): Displays paginated view of which users are in workspace. Allows users not in workspace to be added and workspace to be deleted
- Create (localhost:3000/create): Create users and workspaces. Email will be auto generated from first and last name.

### CRUD Operations

Through the use of Prisma and the defined API routes, this application supports creating, reading, updating, and deleting (CRUD) users and workspaces. The specific implementations of these operations would be found in /src/routes/api, which interacts with the database using Prisma.

## Setup Instructions

1. **Install Dependencies** Navigate to the project directory and run:

```
npm install
```

2. **Run Migrations** To set up the database schema, run:

```
npm run migrate
```

3. **Seed the database**

```
npm run seed
```

4. **Start the Development Server**

```
npm run dev
```

This will start the application in development mode, go to the localhost site indicated in your terminal

5. **Build for Production** When you're ready to build a production version of the app, run:

```
npm run build
```
