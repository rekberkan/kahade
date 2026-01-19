# Security Policy

## Supported Versions

Currently supported versions with security updates:

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |

## Reporting a Vulnerability

**Please do not report security vulnerabilities through public GitHub issues.**

Instead, please report them via email to: security@kahade.com

Include:

- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

We will respond within 48 hours and work with you to address the issue.

## Security Best Practices

### Environment Variables

- Never commit `.env` files
- Use strong secrets in production
- Rotate secrets regularly
- Use environment-specific configurations

### Authentication

- JWT tokens expire after 15 minutes
- Refresh tokens expire after 7 days
- Passwords hashed with bcrypt (10 rounds)
- Email verification required

### Authorization

- Role-based access control (RBAC)
- Guards protect sensitive endpoints
- User permissions validated on each request

### Input Validation

- All inputs validated using DTOs
- class-validator for validation rules
- Sanitization for XSS prevention
- SQL injection prevention via Prisma ORM

### Rate Limiting

- 3 requests per second (burst)
- 20 requests per 10 seconds
- 100 requests per minute
- Configurable per endpoint

### HTTPS

- Force HTTPS in production
- HSTS headers enabled
- SSL/TLS certificates via Let's Encrypt

### Database Security

- Connection pooling
- Parameterized queries (Prisma)
- Regular backups
- Access control

### Dependency Management

- Regular dependency updates
- Security audit: `yarn audit`
- Automated vulnerability scanning

### Logging

- No sensitive data in logs
- Secure log storage
- Regular log rotation
- Monitoring for suspicious activity

## Security Checklist

- [ ] Environment variables secured
- [ ] HTTPS enabled
- [ ] Rate limiting configured
- [ ] Input validation implemented
- [ ] Authentication working
- [ ] Authorization enforced
- [ ] Dependencies up to date
- [ ] Backups automated
- [ ] Monitoring enabled
- [ ] Logs secured

## Disclosure Policy

When we receive a security report:

1. Confirm receipt within 48 hours
2. Provide initial assessment within 7 days
3. Work on fix
4. Release patch
5. Publish security advisory
6. Credit reporter (if desired)

## Contact

For security concerns: security@kahade.com
