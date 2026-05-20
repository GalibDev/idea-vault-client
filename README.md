# IdeaVault

Live site URL: `https://idea-vault-client-sigma.vercel.app`

IdeaVault is a startup idea sharing platform where users can publish concepts, explore community ideas, validate opportunities, and discuss improvements through comments.

## Features

- Public home page with a 3-slide innovation banner, trending ideas, and extra validation-focused sections.
- Ideas page with title search, category filtering, equal cards, and view details navigation.
- Better Auth login, registration, Google login, password validation, toast messages, and persisted JWT session.
- Private routes for Add Idea, My Ideas, My Interactions, Profile Management, and Idea Details.
- Idea submission, update modal, delete action, profile update, and comment add/edit/delete interactions.
- Global dark/light theme toggle, route-based dynamic titles, loading spinner, and custom 404 page.
- Footer includes platform links, contact information, social links including X, and copyright.

## Local Setup

```bash
npm install
npm run dev
```

Client URL: `http://localhost:3000`

## Better Auth Setup

Create `.env.local` from `.env.example` and add your Better Auth, MongoDB, and API values.

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
BETTER_AUTH_SECRET=replace_with_a_long_random_secret
BETTER_AUTH_URL=http://localhost:3000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority
DB_NAME=ideavault
GOOGLE_CLIENT_ID=your_google_oauth_client_id
GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret
```

Email/password authentication runs through Better Auth. Add Google OAuth credentials before testing Google login.

## Submission Checklist

- Client-side GitHub repository: `https://github.com/GalibDev/idea-vault-client`
- Server-side GitHub repository: `https://github.com/GalibDev/idea-vault-server`
- Client commits required: minimum 15 notable commits.
- Server commits required: minimum 8 notable commits.
- Live site URL is included above for Vercel deployment.
