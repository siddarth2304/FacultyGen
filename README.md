# Faculty Timetable Management System

A comprehensive web application for managing faculty timetables, including features for administrators to upload timetables and faculty members to view their schedules and request period swaps.

## Features

- **User Authentication**: Separate login flows for administrators and faculty
- **Timetable Management**: Upload and manage faculty timetables
- **Period Swap System**: Request and approve class swaps between faculty members
- **Schedule Assistant**: Chat interface for faculty to query their schedule
- **Word Document Support**: Upload timetables via Word documents
- **Responsive Design**: Works on desktop and mobile devices

## Mock Credentials

For demo purposes, you can use the following credentials:

### Admin
- **Email**: admin@example.com
- **Password**: any password will work

### Faculty
- **Email**: faculty@example.com
- **Password**: any password will work

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn

### Installation

1. Clone the repository:
   \`\`\`bash
   git clone https://github.com/yourusername/faculty-timetable.git
   cd faculty-timetable
   \`\`\`

2. Install dependencies:
   \`\`\`bash
   npm install
   # or
   yarn install
   \`\`\`

3. Start the development server:
   \`\`\`bash
   npm run dev
   # or
   yarn dev
   \`\`\`

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Deployment

### Deploying to GitHub

1. Create a new GitHub repository:
   \`\`\`bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/faculty-timetable.git
   git push -u origin main
   \`\`\`

### Deploying to Vercel

1. Install the Vercel CLI:
   \`\`\`bash
   npm install -g vercel
   \`\`\`

2. Deploy to Vercel:
   \`\`\`bash
   vercel
   \`\`\`

3. Follow the prompts to complete the deployment.

### Deploying to Netlify

1. Install the Netlify CLI:
   \`\`\`bash
   npm install -g netlify-cli
   \`\`\`

2. Deploy to Netlify:
   \`\`\`bash
   netlify deploy
   \`\`\`

3. Follow the prompts to complete the deployment.

## Project Structure

\`\`\`
faculty-timetable/
├── app/                  # Next.js App Router
│   ├── admin/            # Admin pages
│   ├── faculty/          # Faculty pages
│   ├── login/            # Authentication pages
│   └── page.tsx          # Landing page
├── components/           # React components
├── lib/                  # Utility functions and services
├── public/               # Static assets
└── README.md             # Project documentation
\`\`\`

## Technologies Used

- **Next.js**: React framework for building the application
- **React**: JavaScript library for building user interfaces
- **TypeScript**: Typed JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: UI component library

## License

This project is licensed under the MIT License - see the LICENSE file for details.
\`\`\`

Let's create a package.json file with the necessary dependencies:
