RESUME SETUP INSTRUCTIONS
=========================

To enable the "Download Resume" button functionality:

1. Create or export your resume as a PDF file
2. Name it: resume.pdf
3. Place it in the /public directory of this project
4. The download button in the Hero section will automatically work

Current Path Expected: /public/resume.pdf

The button will trigger a download of this file when clicked.

If you want to use a different filename:
- Update the filename in /src/app/components/Hero.tsx
- Change the line: link.href = '/resume.pdf';
- To your preferred filename
