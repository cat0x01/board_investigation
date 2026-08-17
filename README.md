<<<<<<< HEAD
# CAT0X01 Investigations

CAT0X01 Investigations is a local case-board application for organizing fictional investigations. It gives an analyst one place to create case files, connect people and evidence on a visual board, keep notes, and produce a PDF summary.

The interface has its own fictional intelligence-bureau theme. It is not affiliated with a real agency and does not use official government branding.

## What you can do

- Register an account and sign in with a local password.
- Create cases with a case ID, status, priority, assigned analyst, tags, images, links, and a description.
- Build a visual relationship board with draggable nodes and labeled connections.
- Record confidence, sources, dates, direction, colors, and line styles on connections.
- Search and filter a busy board, hide labels, and switch between grid and corkboard backgrounds.
- Add Markdown notes and link them to board nodes.
- Upload images used by cases and board items.
- Share a case with another local user as a viewer or editor.
- Generate a PDF report from a case.

Everything is stored locally in SQLite, which makes the project convenient for demos and development. It is not intended to hold real sensitive or classified information.

## Running the project

You will need Node.js 20 or newer and npm.
=======
# CAT0X01 INVESTIGATIOONS

CAT0X01 INVESTIGATIOONS is a local-first investigation workspace for building fictional intelligence case boards. It uses Next.js, TypeScript, Tailwind CSS, React Flow, Prisma, SQLite, Zustand, Zod, React Hook Form, Framer Motion, Lucide icons, Recharts, and local uploads.

The app uses the fictional identity **CAT0X01 INVESTIGATIOONS**. It does not use real FBI branding or official logos.

## Features

- Case registry with status, priority, tags, assigned analyst, and descriptions
- Interactive React Flow board with draggable custom intelligence nodes
- Labeled relationship edges with editable color, style, direction, source, date, and confidence
- Autosaved node positions with debounce
- Board search, node-type filters, label visibility, dark grid, and cork texture mode
- Right-side details drawer for node and edge updates
- Evidence vault with manual entries, local uploads in `./uploads`, hashes, source, collector, and chain of custody notes
- Timeline with event creation, filtering, severity, related-node fields, and vertical display
- Markdown notes with preview, tags, pinning, search, and linked-node fields
- Global search for cases, nodes, evidence, notes, events, and relations
- Analytics dashboard with charts and recent activity
- JSON case export, board JSON export, PDF case summary, and visible board PNG export
- Zod validation on API routes and upload protections for size, path traversal, and extension allow-list

## Requirements

- Node.js 20+
- npm

## Setup
>>>>>>> b94b362dc1c9ae54477d93b700bfac957ca2f756

```bash
npm install
cp .env.example .env
<<<<<<< HEAD
npm run db:migrate
npm run db:seed
npm run dev
```

Then visit [http://localhost:3000](http://localhost:3000). The app will send you to the login page, where you can create an account if you do not already have one.

The development and production build scripts deliberately use webpack. Turbopack can intermittently report `Next.js package not found` for this project even while the package is installed and requests continue to succeed. Using webpack avoids that bundler panic and does not change how the application works.

## Local data

Prisma reads the database location from `.env`:
=======
npx prisma migrate dev --name init
npx prisma db seed
npm run dev
```

Open `http://localhost:3000/dashboard`.

## Database

SQLite is configured through Prisma:
>>>>>>> b94b362dc1c9ae54477d93b700bfac957ca2f756

```env
DATABASE_URL="file:../data/caselink.db"
```

<<<<<<< HEAD
Because Prisma resolves that path relative to `prisma/schema.prisma`, the database lives at `data/caselink.db` in the project root. Uploaded files are saved under `uploads/`. Both contain local application data, so take a copy of them before resetting the project.

The seed command adds fictional sample material, including the **Operation Nightfall** case. You can run it again with:

```bash
npm run db:seed
```

After changing the Prisma schema, create a migration and regenerate the client with:

```bash
npm run db:migrate
npm run prisma:generate
```

## Useful commands

```bash
npm run dev              # start the development server
npm run build            # create a production build
npm start                # serve the production build
npm run lint             # check the source with ESLint
npm run prisma:generate  # regenerate the Prisma client
npm run db:migrate       # apply a development migration
npm run db:seed          # load fictional sample data
```

## Technology

The application is built with Next.js, React, TypeScript, Tailwind CSS, React Flow, Prisma, SQLite, Zustand, Zod, React Hook Form, Framer Motion, and jsPDF.
=======
Prisma resolves SQLite URLs from the `prisma/` directory, so `file:../data/caselink.db` creates the requested project-root file:

```text
./data/caselink.db
```

## Demo Data

The seed script creates the fictional case **Operation Nightfall** with suspects, associates, organizations, evidence, malware, device, financial, location, timeline, note, and relationship data. All names and content are fake.

```bash
npx prisma db seed
```

## Migrations

Create or update the local SQLite schema:

```bash
npx prisma migrate dev --name init
```

Regenerate Prisma Client after schema changes:

```bash
npx prisma generate
```

## File Uploads

Evidence uploads are stored in:

```text
./uploads
```

The server:

- rejects paths outside the uploads directory
- limits files to 10 MB
- allows only common document/image/text extensions
- stores files without execute permissions
- never evaluates uploaded content

## API Surface

Implemented routes include:

- `GET /api/cases`
- `POST /api/cases`
- `GET /api/cases/[id]`
- `PATCH /api/cases/[id]`
- `DELETE /api/cases/[id]`
- `GET /api/cases/[id]/nodes`
- `POST /api/cases/[id]/nodes`
- `PATCH /api/nodes/[nodeId]`
- `DELETE /api/nodes/[nodeId]`
- `GET /api/cases/[id]/edges`
- `POST /api/cases/[id]/edges`
- `PATCH /api/edges/[edgeId]`
- `DELETE /api/edges/[edgeId]`
- `GET /api/cases/[id]/evidence`
- `POST /api/cases/[id]/evidence`
- `PATCH /api/evidence/[evidenceId]`
- `DELETE /api/evidence/[evidenceId]`
- `GET /api/cases/[id]/timeline`
- `POST /api/cases/[id]/timeline`
- `GET /api/cases/[id]/notes`
- `POST /api/cases/[id]/notes`
- `GET /api/search?q=`
- `POST /api/export/case/[id]`
- `POST /api/import/case`

## Keyboard Shortcuts

- `Delete`: delete selected board node or edge
- `Ctrl+S`: save visible board positions
- `Ctrl+F`: focus global search
- `Esc`: close the details drawer

## Note About This Workspace

During initial scaffolding this machine reported `ENOSPC: no space left on device` while installing dependencies. The source code is complete, but you may need to free disk space before running `npm install`.
>>>>>>> b94b362dc1c9ae54477d93b700bfac957ca2f756
