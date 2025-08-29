import { auth } from "../services/auth.js";
import { fromNodeHeaders } from "better-auth/node";

// Middleware to require authentication
export async function requireAuth(req, res, next) {
  try {
    // Get session from Better Auth
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });
    
    // Check if user is authenticated
    if (!session?.user) {
      return res.status(401).json({ 
        error: {
          message: "Authentication required",
          statusCode: 401,
          timestamp: new Date().toISOString(),
        }
      });
    }
    
    // Add user info to request object
    req.user = session.user;
    req.session = session;
    
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(401).json({ 
      error: {
        message: "Authentication failed",
        statusCode: 401,
        timestamp: new Date().toISOString(),
      }
    });
  }
}

// Optional middleware for routes that work with or without auth
export async function optionalAuth(req, res, next) {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });
    
    // Add user info if available, but don't block request
    if (session?.user) {
      req.user = session.user;
      req.session = session;
    }
    
    next();
  } catch (error) {
    // Continue without authentication
    next();
  }
}
