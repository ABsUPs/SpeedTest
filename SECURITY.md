# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| Latest  | :white_check_mark: |

Only the latest deployed version at [abspeed.pages.dev](https://abspeed.pages.dev) is supported with security updates.

## Reporting a Vulnerability

If you discover a security vulnerability in ABxSPEED, please report it responsibly.

**How to report:**
- Open an issue at [github.com/ABsUPs/SpeedTest/issues](https://github.com/ABsUPs/SpeedTest/issues)
- Or email the maintainer via [ABsUP on GitHub](https://github.com/ABsUPs)

**What to include:**
- Description of the vulnerability
- Steps to reproduce
- Potential impact

**What to expect:**
- Acknowledgment within 48 hours
- Assessment and update within 7 days
- Credit in the fix commit unless anonymity is requested

## Scope

ABxSPEED is a client-side only speed test tool with no backend, no user accounts, and no data collection. Security concerns are limited to:
- Cross-site scripting (XSS)
- Content Security Policy bypasses
- Insecure resource loading

## Security Headers

The following headers are enforced on all responses:
- `Strict-Transport-Security` (HSTS with preload)
- `Content-Security-Policy` (restrictive policy)
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy` (camera, microphone, geolocation disabled)
