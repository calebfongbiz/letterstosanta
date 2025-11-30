# Letters to Santa™ 🎅

A magical Christmas experience where children write letters to Santa, track their journey to the North Pole, and receive personalized replies.

## Features

### 🆓 Letter to Santa (FREE)
- Submit letters to Santa for your child
- Receive daily elf story email updates
- Magical confirmation email

### ✈️ Santa's Tracker ($14.99)
Everything in FREE, plus:
- Flight-style live tracker visualization
- Watch letters travel through 6 magical locations
- Animated milestone updates
- Add multiple children (+$2.99 each)

### 🎁 The Santa Experience ($29.99)
Everything in Santa's Tracker, plus:
- Personalized Santa letter PDF
- Nice List Certificate PDF
- Option for physical letter delivery
- Priority response

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Prisma + PostgreSQL (Vercel Postgres / Neon)
- **Auth**: Simple passcode-based session auth
- **Integrations**: Make.com webhooks
- **Hosting**: Vercel

---

## 🚀 Deploy to Vercel (Recommended)

### Step 1: Push to GitHub

```bash
# Initialize git and push to GitHub
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/letters-to-santa.git
git push -u origin main
```

### Step 2: Create Vercel Project

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click **"Add New Project"**
3. Import your `letters-to-santa` repository
4. Vercel will auto-detect Next.js - keep the defaults

### Step 3: Add Vercel Postgres Database

1. In your Vercel project, go to **Storage** tab
2. Click **"Create Database"** → **"Postgres"**
3. Name it `letters-to-santa-db` and create
4. Vercel automatically adds the `DATABASE_URL` and `DIRECT_URL` environment variables

### Step 4: Add Environment Variables

In your Vercel project, go to **Settings** → **Environment Variables** and add:

| Variable | Value |
|----------|-------|
| `SESSION_SECRET` | Generate with: `openssl rand -hex 32` |
| `MAKE_WEBHOOK_NEW_ORDER` | Your Make.com webhook URL (or placeholder) |
| `MAKE_WEBHOOK_SECRET` | Generate with: `openssl rand -hex 32` |
| `NEXT_PUBLIC_APP_URL` | `https://your-project.vercel.app` |

### Step 5: Deploy & Initialize Database

1. Click **"Deploy"** (or push to trigger auto-deploy)
2. After deploy, run the database migration:
   - Install Vercel CLI: `npm i -g vercel`
   - Link project: `vercel link`
   - Push schema: `vercel env pull .env.local && npx prisma db push`

Or use the Vercel dashboard:
- Go to **Storage** → Your database → **Data** tab → Run SQL directly

### Step 6: You're Live! 🎉

Visit your deployment URL and start creating Christmas magic!

---

## Local Development

### Prerequisites
- Node.js 18+
- PostgreSQL database (local or cloud)

### Setup

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/letters-to-santa.git
cd letters-to-santa

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local
# Edit .env.local with your database URL and secrets

# Generate Prisma client
npm run db:generate

# Push database schema
npm run db:push

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Project Structure

```
letters-to-santa/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   │   ├── auth/          # Authentication endpoints
│   │   ├── orders/        # Order creation
│   │   └── tracker/       # Tracker updates (Make.com webhook)
│   ├── dashboard/         # Family dashboard
│   ├── track/[trackerId]/ # Individual tracker view
│   ├── tracker-login/     # Login page
│   ├── thank-you/         # Order confirmation
│   ├── write-letter/      # Letter submission form
│   └── page.tsx           # Landing page
├── components/            # Reusable UI components
├── lib/                   # Utilities and helpers
├── prisma/               # Database schema
├── docs/                 # Integration documentation
└── vercel.json           # Vercel configuration
```

---

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | ✅ |
| `DIRECT_URL` | Direct database URL (for migrations) | Optional |
| `SESSION_SECRET` | JWT signing secret (32+ chars) | ✅ |
| `MAKE_WEBHOOK_NEW_ORDER` | Make.com webhook for new orders | Optional |
| `MAKE_WEBHOOK_SECRET` | Secret for webhook authentication | Optional |
| `NEXT_PUBLIC_APP_URL` | Your app's public URL | ✅ |

---

## API Routes

### Public
- `POST /api/orders` - Create new order with letters
- `POST /api/auth/tracker-login` - Authenticate family
- `POST /api/auth/logout` - Clear session

### Protected (Make.com)
- `POST /api/tracker/update` - Update tracker status (requires `x-make-secret` header)

---

## Make.com Integration

See [docs/INTEGRATIONS.md](docs/INTEGRATIONS.md) for complete webhook documentation including:
- Outbound webhook payload structure
- Inbound API authentication
- Suggested automation workflows

---

## Milestones

Letters travel through these magical locations:

1. 📬 **Elf Sorting Station** - Where magic begins
2. 🍬 **Candy Cane Forest** - Through peppermint trees
3. 🦌 **Reindeer Runway** - Dasher gives approval
4. ✨ **Aurora Gate** - Under northern lights
5. 🎅 **Santa's Desk** - Personal reading time
6. 🎁 **North Pole Workshop** - Journey complete!

---

## Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run db:push      # Push schema to database
npm run db:migrate   # Run migrations (dev)
npm run db:studio    # Open Prisma Studio
```

---

## TODO

- [ ] Stripe payment integration
- [ ] File upload for handwritten letters
- [ ] Email sending integration (SendGrid/Resend)
- [ ] Physical letter print/mail service
- [ ] Admin dashboard

---

## License

MIT License - See [LICENSE](LICENSE) for details.

---

Made with ❤️ at the North Pole 🎄
