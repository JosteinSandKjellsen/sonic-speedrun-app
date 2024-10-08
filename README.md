# Sonic Speedrun Scoreboard

This project is a web application that allows users to view, add, and delete speedrun scores for Sonic the Hedgehog's Green Hill Zone - Act 1. It's built using SvelteKit, TypeScript, and Prisma with SQLite.

## Features

- View top 100 speedrun scores
- Add new scores
- Delete scores (password protected)
- Responsive design

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js (v14 or later)
- npm (usually comes with Node.js)

These prerequisites apply to all operating systems (Windows, macOS, and Linux).

## Setting Up the Project

Follow these steps to get your development environment set up:

1. Clone the repository

   ```bash
   git clone https://github.com/JosteinSandKjellsen/sonic-speedrun-scoreboard.git
   cd sonic-speedrun-scoreboard
   ```

2. Install dependencies

   ```bash
   npm install
   ```

3. Set up the database

   ```bash
   npx prisma generate
   npx prisma db push
   ```

## Running the Application

To run the application in development mode:

```bash
npm run dev
```

This will start the development server. Open your browser and navigate to `http://localhost:5173` to view the application.

## Building for Production

To create a production build:

```bash
npm run build
```

To preview the production build:

```bash
npm run preview
```

## Project Structure

- `src/routes/+page.svelte`: Main component for the scoreboard UI
- `src/routes/+page.server.ts`: Server-side logic for loading and manipulating data
- `src/lib/database.ts`: Database operations using Prisma
- `prisma/schema.prisma`: Database schema

## Security Considerations

- The delete functionality is protected by a hardcoded password. In a real-world scenario, this should be replaced with proper authentication.
- Input validation is performed on both client and server sides.
- The application uses Prisma ORM, which provides protection against SQL injection.

## Operating System-Specific Notes

### Windows

- Ensure you have Node.js installed. You can download it from [nodejs.org](https://nodejs.org/).
- You might need to run the command prompt or PowerShell as an administrator for some operations.

### macOS

- We recommend installing Node.js using a version manager like [nvm](https://github.com/nvm-sh/nvm) for easier management.
- You might need to use `sudo` for some commands if you encounter permission issues.

### Linux

- You can install Node.js using your distribution's package manager or using [nvm](https://github.com/nvm-sh/nvm).
- Ensure you have the necessary build tools installed. On Ubuntu or Debian, you can install them with:

  ```bash
  sudo apt-get install build-essential
  ```

## Troubleshooting

If you encounter any issues:

1. Ensure all prerequisites are correctly installed.
2. Try deleting the `node_modules` folder and running `npm install` again.
3. If you have database issues, try deleting the `prisma/dev.db` file and running `npx prisma db push` again.

## Contributing

Contributions to this project are welcome. Please ensure you follow the existing code style and add unit tests for any new features.

## License

This project is licensed under the MIT License - see the LICENSE file for details.