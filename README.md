# IdeaVault

Live site URL: `https://your-ideavault-live-site.vercel.app`

IdeaVault is a startup idea sharing platform where users can publish concepts, explore community ideas, validate opportunities, and discuss improvements through comments.

## Features

- Public home page with a 3-slide innovation banner, trending ideas, and extra validation-focused sections.
- Ideas page with title search, category filtering, equal cards, and view details navigation.
- Authentication UI with login, registration, Google login, password validation, toast messages, and persisted demo JWT session.
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

## Firebase Setup

Create `.env.local` from `.env.example` and paste the Firebase web app values from Firebase Console.

```env
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=idea-vault-1db6f.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=idea-vault-1db6f
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=997184648726
```

Enable Email/Password and Google providers from Firebase Authentication before testing login.

## Submission Checklist

- Client-side GitHub repository: `https://github.com/GalibDev/idea-vault-client`
- Server-side GitHub repository: `https://github.com/GalibDev/idea-vault-server`
- Client commits required: minimum 15 notable commits.
- Server commits required: minimum 8 notable commits.
- Replace the live site URL above after deploying on Vercel, Render, Netlify, or another host.
