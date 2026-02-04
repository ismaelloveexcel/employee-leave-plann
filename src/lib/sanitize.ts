/**
 * Sanitize text input to prevent XSS attacks
 * Removes potentially dangerous HTML tags and scripts
 */
export function sanitizeText(text: string): string {
  if (!text) return '';
  
  // Trim whitespace
  let sanitized = text.trim();
  
  // Remove HTML tags
  sanitized = sanitized.replace(/<[^>]*>/g, '');
  
  // Remove script tags specifically (extra safety)
  sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  
  // Remove event handlers
  sanitized = sanitized.replace(/on\w+\s*=\s*["'][^"']*["']/gi, '');
  
  // Limit length to prevent abuse
  const maxLength = 1000;
  if (sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength);
  }
  
  return sanitized;
}

/**
 * Sanitize email input
 */
export function sanitizeEmail(email: string): string {
  if (!email) return '';
  
  // Trim and lowercase
  let sanitized = email.trim().toLowerCase();
  
  // Remove any HTML
  sanitized = sanitized.replace(/<[^>]*>/g, '');
  
  // Basic email validation pattern
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!emailPattern.test(sanitized)) {
    return '';
  }
  
  return sanitized;
}

/**
 * Escape HTML entities to prevent XSS
 */
export function escapeHtml(text: string): string {
  if (!text) return '';
  
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  
  return text.replace(/[&<>"']/g, (char) => map[char]);
}
