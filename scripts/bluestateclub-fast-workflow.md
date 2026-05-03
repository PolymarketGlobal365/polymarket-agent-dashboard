Blue State Club fast workflow

Goal:
- Keep the output pattern fixed: `4 PNG slides + 1 TXT note` in one folder.
- Use `Photoshop 2026` in CLI mode instead of hand-driving the app.

Recommended repeat loop:
1. Pick one article and decide the folder name.
2. Prepare the card copy:
   - slide 1 title
   - slide 2 summary
   - slide 3 headline / subtitle / body
   - note title / 5-line summary / one-line take / 5 hashtags
3. Run a targeted JSX through `scripts/invoke-photoshop-2026-job.ps1`.
4. Save the text note with `scripts/new-bluestateclub-note.ps1`.
5. Deliver the folder in `F:\bluestateclub\<story-name>`.

What makes this faster now:
- Photoshop launch path is fixed to `C:\Program Files\Adobe\Adobe Photoshop 2026\Photoshop.exe`
- output polling is standardized
- note file generation is standardized
- folder structure is standardized

Current delivery shape:
- `01.png`
- `02.png`
- `03.png`
- `04.png`
- `<folder-name>.txt`
