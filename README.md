# TaskyFlow Vue

A collaborative task management platform built with Vue.js, Convex, and Tailwind CSS.

## Features

- **Task Management**: Create, organize, and track tasks with priority levels, due dates, and custom tags
- **Real-time Collaboration**: Comments, reactions, and instant notifications
- **Direct Messaging**: Communicate seamlessly with team members through integrated chat functionality
- **Admin Dashboard**: Analytics and user management
- **Responsive Design**: Mobile-first with drawer/modal patterns
- **Authentication**: OAuth (GitHub, Google) and email/password authentication

## Tech Stack

- **Frontend**: Vue.js 3, TypeScript, Tailwind CSS
- **Backend**: Convex (real-time database)
- **Auth**: Convex Auth
- **UI**: Headless UI + Heroicons
- **State**: Pinia
- **Forms**: Vue 3 Composition API
- **Build Tool**: Vite

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Convex account

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd taskyflow-vue
```

2. Install dependencies:
```bash
npm install
```

3. Set up Convex:
```bash
npx convex dev
```

4. Copy the environment file:
```bash
cp env.example .env.local
```

5. Add your Convex URL to `.env.local`:
```
VITE_CONVEX_URL=your_convex_url_here
```

6. Start the development server:
```bash
npm run dev
```

## Project Structure

```
src/
├── components/          # Reusable Vue components
│   ├── auth/           # Authentication components
│   ├── dashboard/      # Dashboard-specific components
│   ├── forms/          # Form components
│   └── landing/        # Landing page components
├── views/              # Page components
├── stores/             # Pinia stores
├── composables/        # Vue composables
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
└── router/             # Vue Router configuration

convex/                 # Convex backend functions
├── schema.ts          # Database schema
├── todos.ts           # Todo-related functions
├── chats.ts           # Chat-related functions
├── comments.ts        # Comment-related functions
├── reactions.ts       # Reaction-related functions
└── notifications.ts   # Notification-related functions
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## Environment Variables

- `VITE_CONVEX_URL` - Your Convex deployment URL

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is licensed under the MIT License.
# vue-exam
