# GitHub Analytics Dashboard

A minimal, fast, and secure dashboard to visualize your GitHub profile and repository statistics.

## Features

- GitHub OAuth Authentication
- Real-time GitHub API data fetching
- Interactive charts

## Tech Stack

- Next.js (App Router)
- Tailwind CSS
- NextAuth.js
- Recharts

## Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/samarthgalhe89/github-analytics-dashboard.git
   cd github-analytics-dashboard
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables in `.env.local`:
   ```env
   GITHUB_ID=your_client_id
   GITHUB_SECRET=your_client_secret
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your_secret
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

## License

MIT
