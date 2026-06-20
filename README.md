# ResumeAI — AI-Powered Resume Builder

A complete web application that generates professional resumes in seconds using AI.

## Features
- Beautiful landing page (sell-ready)
- User enters only Name + Designation
- AI generates complete resume (summary, experience, skills, education, certifications)
- Edit any field directly on the resume
- Download as PDF
- Fully responsive (mobile + desktop)

## Project Structure
```
resume-builder/
├── index.html          ← Main app file
├── css/
│   └── style.css       ← All styles
├── js/
│   └── app.js          ← All logic + AI API calls
└── README.md
```

## How to Run Locally
Just open `index.html` in any browser. No build tools needed.

> Note: The AI API calls require an Anthropic API key.
> To add your key, open `js/app.js` and add this header to the fetch call:
> `'x-api-key': 'YOUR_ANTHROPIC_API_KEY'`

## How to Deploy (Free Options)

### Option 1 — Netlify (Recommended, Free)
1. Go to https://netlify.com
2. Drag & drop the `resume-builder` folder
3. Your app is live instantly!

### Option 2 — Vercel (Free)
1. Go to https://vercel.com
2. Upload the folder
3. Done!

### Option 3 — GitHub Pages (Free)
1. Create a GitHub repo
2. Upload all files
3. Enable GitHub Pages in Settings

## To Sell This App
- Host on Netlify/Vercel for free
- Add a custom domain (e.g. resumeai.in) — ~₹500/year
- Use Razorpay to charge users (₹99–₹299 per resume)
- Or sell as a SaaS with monthly subscription

## Customization
- Change brand colors: Edit `#5046E5` in style.css
- Change app name: Search "ResumeAI" in index.html
- Add more fields: Edit the form in index.html + prompt in app.js

## Tech Stack
- Pure HTML, CSS, JavaScript (no frameworks needed)
- Claude AI (claude-sonnet-4-6) for resume generation
- Google Fonts (Inter + Playfair Display)
- Browser Print API for PDF download
