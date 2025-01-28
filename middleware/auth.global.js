// middleware/auth.global.js

export default defineNuxtRouteMiddleware((to, from) => {
    if (import.meta.server) return // Skip on the server side

    const isAuthenticated = !!localStorage.getItem('token');  // Check if user is authenticated

    // List of protected routes where the user must be authenticated
    const protectedRoutes = ['/dashboard', '/profile', '/settings'];  // Add your protected routes here

    // If the user is not authenticated and trying to access a protected route, redirect to login
   /* if (!isAuthenticated && protectedRoutes.includes(to.path)) {
        return navigateTo('/login');  // Redirect to login page
    }*/

    // If the user is authenticated and trying to access the login or register page, redirect to home
    if (isAuthenticated && (to.path === '/login' || to.path === '/register')) {
        return navigateTo('/');  // Redirect to home page
    }
});
