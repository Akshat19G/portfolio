# Portfolio Customization Checklist

Use this checklist to personalize your portfolio with your own information.

## ✅ Required Updates

### 1. EmailJS Configuration (CRITICAL for contact form)
- [ ] Create EmailJS account at https://emailjs.com
- [ ] Set up email service
- [ ] Create email template
- [ ] Update credentials in `/src/app/components/Contact.tsx`:
  - Replace `YOUR_SERVICE_ID`
  - Replace `YOUR_TEMPLATE_ID`
  - Replace `YOUR_PUBLIC_KEY`
- [ ] Test contact form functionality

### 2. Personal Information

#### Hero Section (`/src/app/components/Hero.tsx`)
- [ ] Update main heading text (currently: "Building AI Systems For The Future")
- [ ] Update subtitle (currently: "Machine Learning Engineer • AI Systems Builder • Future AI Founder")
- [ ] Update GitHub URL in `handleGithubClick()` (currently: https://github.com/akshat-srivastava)
- [ ] Update tech stack badges (currently: Python, TensorFlow, PyTorch, Scikit-learn)

#### Navigation (`/src/app/components/Navigation.tsx`)
- [ ] Update logo/initials (currently: "AS")
- [ ] Verify section names match your content

#### Contact Section (`/src/app/components/Contact.tsx`)
- [ ] Update email address (currently: srivastavaakshat1909@gmail.com)
- [ ] Update GitHub username (currently: @akshat-srivastava)
- [ ] Customize "Why Connect?" list items

#### Footer (`/src/app/components/Footer.tsx`)
- [ ] Update social media links:
  - GitHub: https://github.com/YOUR_USERNAME
  - LinkedIn: https://linkedin.com/in/YOUR_PROFILE
  - Twitter: https://twitter.com/YOUR_HANDLE
  - Email: your.email@example.com
- [ ] Update footer name (currently: Akshat Srivastava)

### 3. About Section (`/src/app/components/About.tsx`)
- [ ] Customize roadmap phases with your journey
- [ ] Update vision statement
- [ ] Adjust descriptions to match your experience

### 4. Tech Stack (`/src/app/components/TechStack.tsx`)
- [ ] Add/remove skills based on your expertise
- [ ] Update proficiency percentages
- [ ] Modify skill descriptions
- [ ] Change color gradients if desired

### 5. Projects Section (`/src/app/components/Projects.tsx`)
- [ ] Replace with your actual projects
- [ ] Update project titles and descriptions
- [ ] Add real GitHub repository links
- [ ] Add live demo links
- [ ] Update project tags/technologies
- [ ] Update project statistics
- [ ] Change project icons if needed

### 6. Analytics Section (`/src/app/components/Analytics.tsx`)
- [ ] Update GitHub statistics with your actual numbers
- [ ] Update Kaggle ranking (if applicable)
- [ ] Optionally: Integrate real GitHub API for live data

## 📋 Optional Updates

### Resume Download
- [ ] Create/export your resume as PDF
- [ ] Name it `resume.pdf`
- [ ] Place in `/public` directory
- [ ] Test download button in Hero section

### Color Scheme
- [ ] Customize gradient colors in components
- [ ] Adjust blue/cyan theme if desired
- [ ] Update accent colors

### Content
- [ ] Add more projects if you have them
- [ ] Add certifications section (optional)
- [ ] Add blog/articles section (optional)
- [ ] Add testimonials (optional)

### Images & Branding
- [ ] Add favicon in `/public`
- [ ] Add OG image for social sharing
- [ ] Add profile picture (if desired)

### SEO (for production)
- [ ] Update page title in HTML
- [ ] Add meta description
- [ ] Add Open Graph tags
- [ ] Add Twitter Card tags
- [ ] Create sitemap.xml

## 🧪 Testing Checklist

After customization:
- [ ] Test all navigation links
- [ ] Test smooth scrolling
- [ ] Test contact form submission
- [ ] Test resume download button
- [ ] Test GitHub project links
- [ ] Test external social links
- [ ] Test on mobile devices
- [ ] Test on different browsers
- [ ] Verify animations work smoothly
- [ ] Check for console errors

## 🚀 Deployment Checklist

Before deploying:
- [ ] EmailJS credentials configured
- [ ] All personal information updated
- [ ] All placeholder links replaced
- [ ] Resume PDF added
- [ ] Tested thoroughly
- [ ] Remove console.log statements
- [ ] Optimize images
- [ ] Build production version
- [ ] Test production build

## 📝 Quick Find & Replace

Use your code editor to find and replace these placeholders globally:

1. **Name:** "Akshat Srivastava" → "Your Name"
2. **Email:** "srivastavaakshat1909@gmail.com" → "your.email@example.com"
3. **GitHub:** "akshat-srivastava" → "your-github-username"
4. **Initials:** "AS" → "YI" (Your Initials)

## 💡 Tips

- Start with EmailJS setup - it's the only critical external dependency
- Update one section at a time and test
- Keep backups before making major changes
- Use git to track your customizations
- Test contact form with a real email before deployment

---

**Need help?** Check README.md for detailed documentation.
