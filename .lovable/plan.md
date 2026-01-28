
## Remove AI Voice Agent

This is a straightforward removal task. The ElevenLabs voice widget needs to be removed from two files.

### Changes Required

**1. src/App.tsx**
- Remove the `<elevenlabs-convai>` custom element (lines 33-34)
- Remove the associated TypeScript ignore comment

**2. index.html**
- Remove the ElevenLabs script tag that loads the widget embed library (line 25)

### Technical Details

| File | Lines to Remove |
|------|-----------------|
| `src/App.tsx` | Lines 33-34: The custom element and its comment |
| `index.html` | Line 25: The external script loader |

No other files reference the voice agent, so these two changes will completely remove it from your site.
