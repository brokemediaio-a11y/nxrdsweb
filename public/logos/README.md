# Technology Logos

This folder contains SVG/PNG logos for all technologies displayed in the Tech Stack section.

## Required Logos

Please download and place the following logo files here (all lowercase with hyphens):

### Format: SVG (preferred) or PNG with transparent background

1. **n8n.svg** - Automation platform
   - Source: https://github.com/n8n-io/n8n/tree/main/packages/design-system/src/assets/icons

2. **react.svg** - React framework
   - Source: https://simpleicons.org/icons/react.svg

3. **mongodb.svg** - MongoDB database
   - Source: https://simpleicons.org/icons/mongodb.svg

4. **nextjs.svg** - Next.js framework
   - Source: https://simpleicons.org/icons/nextdotjs.svg

5. **postgresql.svg** - PostgreSQL database
   - Source: https://simpleicons.org/icons/postgresql.svg

6. **python.svg** - Python language
   - Source: https://simpleicons.org/icons/python.svg

7. **fastapi.svg** - FastAPI framework
   - Source: https://simpleicons.org/icons/fastapi.svg

8. **nodejs.svg** - Node.js runtime
   - Source: https://simpleicons.org/icons/nodedotjs.svg

9. **jupyter.svg** - Jupyter notebook
   - Source: https://simpleicons.org/icons/jupyter.svg

10. **colab.svg** - Google Colab
    - Source: https://simpleicons.org/icons/googlecolab.svg

11. **vuejs.svg** - Vue.js framework
    - Source: https://simpleicons.org/icons/vuedotjs.svg

12. **twilio.svg** - Twilio API
    - Source: https://simpleicons.org/icons/twilio.svg

13. **elevenlabs.svg** - ElevenLabs AI
    - Source: Official brand assets from ElevenLabs

14. **cal-com.svg** - Cal.com
    - Source: https://github.com/calcom/cal.com/tree/main/public/logo.svg

15. **openai.svg** - OpenAI/ChatGPT
    - Source: https://simpleicons.org/icons/openai.svg

16. **google-workspace.svg** - Google Workspace
    - Source: https://simpleicons.org/icons/googleworkspace.svg

17. **aws.svg** - Amazon Web Services
    - Source: https://simpleicons.org/icons/amazonaws.svg

18. **hostinger.svg** - Hostinger
    - Source: https://simpleicons.org/icons/hostinger.svg

19. **docker.svg** - Docker
    - Source: https://simpleicons.org/icons/docker.svg

20. **typescript.svg** - TypeScript
    - Source: https://simpleicons.org/icons/typescript.svg

## Quick Download Script

You can use Simple Icons (https://simpleicons.org/) for most logos. They provide SVG files in monochrome which work well with CSS filters.

## Logo Requirements

- **Format:** SVG preferred (scalable, crisp)
- **Fallback:** PNG with transparent background (512x512px minimum)
- **Color:** White/monochrome versions preferred (we style them with CSS)
- **Size:** Should be visually balanced (logos will be scaled to 80x80px in the component)

## Styling

Logos are automatically styled with:
- Brightness filter: `brightness(1.1)`
- Drop shadow for depth
- Centered and contained within 80x80px area

If a logo doesn't load, the component will hide it and display only the technology name.