# Xray-Web-Config-Generator

A web-based frontend for generating and editing Xray configurations. Supports both single-file and multi-file modes with form-based UI and JSON editor.

## Features

- **Dual-view editing**: Form + JSON synchronized editing
- **Single/Multi-file modes**: Choose between monolithic or modular config structure
- **Real-time validation**: Immediate JSON parsing feedback
- **File management**: Add/remove routing, inbound, outbound config files
- **Merge preview**: Preview final merged configuration
- **Light/Dark theme**: Auto-switches based on system preference
- **Fully offline**: No server requirements, runs completely in browser

## Usage

Live version: [https://xray-config.waku.icu](https://xray-config.waku.icu)

### Recommended
- Desktop/Laptop (1920×1080 or larger)
- Tablet (768px+) in landscape mode

### Not Recommended
- Mobile phones (small screens < 640px)
  - UI elements become cramped
  - Sidebar auto-hides on screens < 480px
  - Use desktop version for optimal experience

## Local Development

```bash
# No build step needed - just serve with any HTTP server
python -m http.server 8080
# or
npx http-server .
```

Then open http://localhost:8080

## Technical Details

- **Frontend**: Vanilla HTML/CSS/JavaScript (no dependencies)
- **Architecture**: Schema-driven form generation from xray protocol definitions
- **Browser Support**: Modern browsers with ES6 support
- **Data**: All changes are client-side only

Developed with *ChatGPT* & *GitHub Copilot*

