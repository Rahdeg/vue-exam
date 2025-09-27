# Middleware System

This directory contains the middleware system for the Vue.js TaskyFlow application, providing authentication and authorization functionality similar to Next.js middleware.

## Structure

```
middleware/
├── index.ts          # Main middleware exports and global middleware
├── auth.ts           # Authentication middleware
├── guest.ts          # Guest-only page middleware
├── types.ts          # TypeScript type definitions
└── README.md         # This file
```

## Features

### 1. Authentication Middleware (`auth.ts`)
- Checks if user is authenticated
- Handles admin role verification
- Redirects unauthenticated users to login
- Protects routes that require authentication

### 2. Guest Middleware (`guest.ts`)
- Redirects authenticated users away from guest-only pages
- Prevents logged-in users from accessing auth pages
- Ensures proper user flow

### 3. Global Middleware (`index.ts`)
- Combines all middleware functions
- Provides route classification utilities
- Handles the main middleware logic

## Usage

### In Router
The middleware is automatically applied to all routes through Vue Router's navigation guards:

```typescript
import { globalMiddleware } from '@/middleware'

router.beforeEach(async (to) => {
  return await globalMiddleware(to)
})
```

### In Components
Use the composables for authentication state:

```vue
<script setup>
import { useAuth, usePermissions } from '@/composables/useMiddleware'

const { isAuthenticated, user, isAdmin } = useAuth()
const { canAccessAdmin, canCreateTasks } = usePermissions()
</script>
```

### Route Meta Properties
Configure routes with appropriate meta properties:

```typescript
{
  path: '/dashboard',
  component: Dashboard,
  meta: { requiresAuth: true }
},
{
  path: '/admin',
  component: Admin,
  meta: { requiresAuth: true, requiresAdmin: true }
},
{
  path: '/auth',
  component: Auth,
  meta: { requiresGuest: true }
}
```

## Route Protection

### Public Routes
- `/` - Landing page (accessible to all)
- `/auth` - Authentication pages (guest-only)

### Protected Routes
- `/dashboard` - Requires authentication
- `/settings` - Requires authentication
- `/chat/:id` - Requires authentication

### Admin Routes
- `/admin` - Requires authentication + admin role

## Middleware Flow

1. **Guest Middleware**: Redirects authenticated users from guest pages
2. **Auth Middleware**: Checks authentication and admin requirements
3. **Route Access**: Allows or redirects based on user state

## Customization

### Adding New Middleware
1. Create a new middleware file (e.g., `role.ts`)
2. Export a middleware function that returns `string | boolean | void`
3. Import and use in the global middleware

### Modifying Admin Logic
Update the `checkAdmin()` function in `auth.ts` to implement your admin role logic:

```typescript
export async function checkAdmin(): Promise<boolean> {
  await waitForAuth()
  const { user } = useConvexAuth()
  
  // Add your admin check logic here
  return user.value?.role === 'admin'
}
```

## Comparison with Next.js Middleware

| Feature | Next.js | Vue.js |
|---------|---------|--------|
| Route Protection | `middleware.ts` | Router guards + middleware |
| Authentication | `isAuthenticatedNextjs()` | `useConvexAuth()` |
| Redirects | `nextjsMiddlewareRedirect()` | Return redirect path |
| Route Matching | `createRouteMatcher()` | `isPublicRoute()` / `isAdminRoute()` |
| Admin Check | Custom logic | `checkAdmin()` function |

The Vue.js implementation provides equivalent functionality while leveraging Vue's composition API and reactive system.
