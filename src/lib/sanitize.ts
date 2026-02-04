/**
 * Sanitize text input to prevent XSS attacks
 * Uses multiple passes and escaping to ensure complete sanitization
 * 
 * Security Note: This uses a multi-layered approach:
 * 1. Remove HTML tags (including malformed/incomplete ones)
 * 2. Remove any remaining angle brackets
 * 3. Escape HTML entities
 * This defense-in-depth approach prevents XSS even if one layer fails.
 */
export function sanitizeText(text: string): string {
  if (!text) return '';
  
  // Trim whitespace
  let sanitized = text.trim();
  
  // First pass: Remove complete HTML tags (including malformed ones)
  // This handles cases like <script>, <ScRiPt>, etc.
  sanitized = sanitized.replace(/<[^>]*>?/gi, '');
  
  // Second pass: Remove any remaining < or > characters (defense in depth)
  sanitized = sanitized.replace(/[<>]/g, '');
  
  // Third pass: Escape any HTML entities that might have been introduced
  sanitized = escapeHtml(sanitized);
  
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
  
  // Remove any HTML tags
  sanitized = sanitized.replace(/<[^>]*>?/gi, '');
  
  // Remove any remaining < or > characters
  sanitized = sanitized.replace(/[<>]/g, '');
  
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
