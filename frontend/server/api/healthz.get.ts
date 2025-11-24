/**
 * Health check endpoint for monitoring application status
 * Available at /api/healthz
 */
export default defineEventHandler(async (event) => {
  return {
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    service: 'personal-notes-organizer',
    environment: process.env.NODE_ENV || 'development'
  }
})
