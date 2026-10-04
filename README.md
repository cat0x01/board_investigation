# CAT0X01 Investigations

A local case-board app for fictional investigations. Create cases, connect people and evidence on a visual board, write notes, share cases, and export PDF reports.

## Features

- Create and manage investigation cases
- Build visual relationship boards
- Add notes, images, links, tags, and sources
- Share cases as a viewer or editor
- Export case reports as PDF
- Store data locally with SQLite

## Run locally

Requirements: Node.js 20+ and npm.

```bash
npm install
cp .env.example .env
npm run db:migrate
npm run db:seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and create an account.

## Useful commands

```bash
npm run dev              # start the app
npm run build            # create a production build
npm start                # run the production build
npm run lint             # check the code
npm run db:migrate       # apply database changes
npm run db:seed          # add sample data
npm run prisma:generate  # update the Prisma client
```

## Local data

The database is stored in `data/caselink.db`. Uploaded files are stored in `uploads/`. Both folders contain local app data.

The seed command adds fictional sample data, including the **Operation Nightfall** case.


