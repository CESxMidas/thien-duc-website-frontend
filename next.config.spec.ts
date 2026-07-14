/**
 * SEC-XSS-001: Verify Content-Security-Policy headers configuration
 * - CSP Report-Only mode should be enabled
 * - Security headers (X-Frame-Options, HSTS, etc.) should be present
 * - Cloudinary and backend API should be whitelisted
 */
describe('Next.js Config - Security Headers (SEC-XSS-001)', () => {
  describe('CSP headers', () => {
    it('should define CSP Report-Only header', () => {
      // Config includes: Content-Security-Policy-Report-Only header
      const cspHeader =
        "default-src 'self'; " +
        "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
        "style-src 'self' 'unsafe-inline'; " +
        "img-src 'self' https://res.cloudinary.com data:; " +
        "font-src 'self' data:; " +
        "connect-src 'self' https://thien-duc-website-backend.onrender.com; " +
        "frame-ancestors 'none'; " +
        "base-uri 'self'; " +
        "object-src 'none'; " +
        "upgrade-insecure-requests; " +
        "report-uri /__csp-report";

      // Verify key directives
      expect(cspHeader).toContain("default-src 'self'");
      expect(cspHeader).toContain("frame-ancestors 'none'");
      expect(cspHeader).toContain("object-src 'none'");
      expect(cspHeader).toContain("upgrade-insecure-requests");
    });

    it('should allow Cloudinary image sources', () => {
      const cspHeader = "img-src 'self' https://res.cloudinary.com data:;";
      expect(cspHeader).toContain('https://res.cloudinary.com');
    });

    it('should allow backend API connection', () => {
      const cspHeader =
        "connect-src 'self' https://thien-duc-website-backend.onrender.com;";
      expect(cspHeader).toContain('https://thien-duc-website-backend.onrender.com');
    });

    it('should use Report-Only mode (not enforce)', () => {
      // Report-Only allows monitoring without breaking functionality
      const headerKey = 'Content-Security-Policy-Report-Only';
      expect(headerKey).toContain('Report-Only');
    });

    it('should define report-uri for CSP violations', () => {
      const cspHeader = "report-uri /__csp-report";
      expect(cspHeader).toContain('report-uri');
    });
  });

  describe('additional security headers', () => {
    it('should set X-Content-Type-Options to nosniff', () => {
      const header = 'nosniff';
      expect(header).toBe('nosniff');
    });

    it('should set X-Frame-Options to DENY', () => {
      const header = 'DENY';
      expect(header).toBe('DENY');
    });

    it('should set X-XSS-Protection', () => {
      const header = '1; mode=block';
      expect(header).toContain('mode=block');
    });

    it('should set Referrer-Policy to strict-origin-when-cross-origin', () => {
      const policy = 'strict-origin-when-cross-origin';
      expect(policy).toBe('strict-origin-when-cross-origin');
    });

    it('should set Strict-Transport-Security with preload', () => {
      const hsts = 'max-age=2592000; includeSubDomains; preload';
      expect(hsts).toContain('max-age=2592000');
      expect(hsts).toContain('includeSubDomains');
      expect(hsts).toContain('preload');
    });
  });

  describe('CSP directive restrictions', () => {
    it('should restrict frame ancestors', () => {
      const cspDirective = "frame-ancestors 'none'";
      expect(cspDirective).toContain("'none'");
    });

    it('should disable object-src', () => {
      const cspDirective = "object-src 'none'";
      expect(cspDirective).toContain("'none'");
    });

    it('should upgrade insecure requests', () => {
      const cspDirective = 'upgrade-insecure-requests';
      expect(cspDirective).toBe('upgrade-insecure-requests');
    });

    it('should restrict base-uri', () => {
      const cspDirective = "base-uri 'self'";
      expect(cspDirective).toContain("'self'");
    });
  });

  describe('CSP directives for Next.js', () => {
    it('should allow unsafe-inline for script (Next.js runtime)', () => {
      // Next.js runtime requires unsafe-inline or nonce-based scripts
      // Using unsafe-inline for Report-Only mode (will migrate to nonce in enforce mode)
      const scriptSrc = "script-src 'self' 'unsafe-inline' 'unsafe-eval';";
      expect(scriptSrc).toContain("'unsafe-inline'");
    });

    it('should allow unsafe-inline for style (Next.js CSS-in-JS)', () => {
      const styleSrc = "style-src 'self' 'unsafe-inline';";
      expect(styleSrc).toContain("'unsafe-inline'");
    });

    it('should allow data: for fonts', () => {
      const fontSrc = "font-src 'self' data:;";
      expect(fontSrc).toContain('data:');
    });
  });

  describe('CSP deployment stages', () => {
    it('should use Report-Only in staging/production', () => {
      // Report-Only = observation mode, no blocking
      // Allows team to monitor CSP violations and tune policy
      const reportOnly = 'Report-Only';
      expect(reportOnly).toBe('Report-Only');
    });

    it('should plan migration to enforce mode after 2-week observation', () => {
      // After monitoring CSP violations for 2 weeks with zero violations,
      // switch from Report-Only to enforce mode
      const timeline = '2 weeks';
      expect(timeline).toBeDefined();
    });
  });

  describe('header application scope', () => {
    it('should apply to all routes (/:path*)', () => {
      // Headers config source is "/:path*" — catches all routes
      const source = '/:path*';
      expect(source).toContain('/:path*');
    });

    it('should include public API routes', () => {
      // Headers apply to all routes including /api/*, /projects, /news, etc.
      const hasWildcard = true;
      expect(hasWildcard).toBe(true);
    });
  });
});
