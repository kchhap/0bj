import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"

// Define public routes that don't require authentication
const isPublicRoute = createRouteMatcher(["/", "/signin(.*)", "/signup(.*)", "/pricing(.*)"])

export default clerkMiddleware(async (auth, req) => {
  // Allow public access to the main page, sign-in, sign-up, and pricing routes
  if (isPublicRoute(req)) return

  // Protect all other routes
  const { userId } = await auth()
  if (!userId) {
    // Redirect to sign-in if not authenticated
    const signInUrl = new URL("/signin", req.url)
    return Response.redirect(signInUrl)
  }
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
}
