# Employee Details Update - Embeddable Form Guide

## Overview

This feature allows employees to update their contact details without seeing the URL. Perfect for:
- **Company intranet embedding** - No URL visible to employees
- **QR code distribution** - Scan and update
- **Direct sharing** - Via email, WhatsApp, or SMS

## 🎯 Use Cases

### 1. Embed in Company Intranet
Employees access the form directly within your company portal without seeing external URLs.

### 2. QR Code in Office
Print and place QR codes in common areas. Employees scan to access the form.

### 3. Direct Link Sharing
Share links via email or messaging apps with pre-filled employee IDs.

---

## 🔗 URL Formats

### Standard Update Mode
```
https://your-domain.com/?mode=update
```
Opens the update form in standalone mode with full navigation.

### Embedded Mode (No URL Visible)
```
https://your-domain.com/?mode=update&embed=true
```
Minimal interface designed for iframe embedding. Perfect for intranet.

### Pre-filled Employee ID
```
https://your-domain.com/?mode=update&employeeId=BAYN00002
```
Employee ID is pre-filled, employee only needs to enter date of birth.

### Combined (Embedded + Pre-filled)
```
https://your-domain.com/?mode=update&embed=true&employeeId=BAYN00002
```

---

## 📋 Implementation Methods

### Method 1: Iframe Embedding (Recommended for Intranet)

Add this code to your company intranet page:

```html
<iframe 
  src="https://your-domain.com/?mode=update&embed=true" 
  width="100%" 
  height="600" 
  frameborder="0"
  style="border: 1px solid #e5e7eb; border-radius: 8px;"
  title="Employee Details Update Form"
></iframe>
```

**Benefits:**
- ✅ Employees never see the URL
- ✅ Seamless integration with intranet
- ✅ Consistent user experience
- ✅ No navigation away from portal

### Method 2: QR Code Distribution

1. **Generate QR Code:**
   - Access the link generator in HR Admin Panel
   - Enter employee ID (optional)
   - Download the QR code image

2. **Print and Display:**
   - Print QR code posters
   - Place in common areas (break room, reception, notice boards)
   - Employees scan with phone camera

3. **Benefits:**
   - ✅ No URL to type or see
   - ✅ Mobile-friendly access
   - ✅ Modern and professional
   - ✅ Easy updates anytime

### Method 3: Direct Link Sharing

Share via email, WhatsApp, or SMS:

**Email Template:**
```
Subject: Update Your Employee Contact Details

Hi [Employee Name],

Please update your contact information by clicking this link:
https://your-domain.com/?mode=update&employeeId=[EMPLOYEE_ID]

You'll need your date of birth to verify your identity.

Thanks,
HR Team
```

**WhatsApp/SMS Template:**
```
Hi! Please update your details here: https://short.link/update
Use Employee ID: [EMPLOYEE_ID] and your DOB.
```

---

## 🔒 Security

### Authentication Required
All update forms require:
1. **Employee ID** - Unique identifier
2. **Date of Birth** - Password in DDMMYYYY format

No updates possible without proper authentication.

### Data Protection
- Updates only allowed for authenticated employee
- No data visible to unauthenticated users
- Changes immediately saved to secure storage
- Audit trail maintained (future enhancement)

---

## 🛠️ Setup Instructions for IT

### Step 1: Access the Link Generator

1. Login as a manager/admin
2. Navigate to HR Admin Panel
3. Find "Generate Update Links" section

### Step 2: Generate Links

**For General Use:**
- Leave Employee ID blank
- Copy the generated link
- Share with all employees

**For Individual Employees:**
- Enter specific Employee ID
- Generate personalized link
- Send directly to that employee

### Step 3: Choose Distribution Method

**A. Intranet Embedding:**
```html
1. Copy the iframe code
2. Paste into your intranet HTML
3. Adjust width/height as needed
4. Test the embedded form
```

**B. QR Code:**
```
1. Generate QR code
2. Download as PNG
3. Print on posters/flyers
4. Display in office
```

**C. Direct Sharing:**
```
1. Copy the direct link
2. Share via email/WhatsApp
3. Include instructions
```

---

## 📱 Employee Instructions

### Using Embedded Form (Intranet)
1. Open company intranet
2. Navigate to employee portal
3. Find "Update Details" section
4. Enter Employee ID and DOB
5. Update information
6. Click Save

### Using QR Code
1. Open phone camera
2. Point at QR code
3. Tap notification to open link
4. Enter Employee ID and DOB
5. Update information
6. Click Save

### Using Direct Link
1. Click the link shared by HR
2. Form opens in browser
3. Enter credentials if needed
4. Update information
5. Click Save

---

## 🎨 Customization

### Change iframe size:
```html
<iframe 
  src="..." 
  width="100%"    <!-- Adjust width -->
  height="700"    <!-- Adjust height -->
  ...
></iframe>
```

### Add custom styling:
```html
<div style="max-width: 800px; margin: 0 auto; padding: 20px;">
  <iframe src="..." width="100%" height="600"></iframe>
</div>
```

---

## 📊 Tracking Updates

### Admin View
- View updated employee records in HR Admin Panel
- Check last update timestamp
- Export employee data to CSV
- Monitor completion rates

### Future Enhancements
- Email notifications on updates
- Update history/audit log
- Bulk update campaigns
- Update reminders

---

## ❓ Troubleshooting

### Issue: Form not loading in iframe
**Solution:** Check if Content Security Policy allows iframe embedding
```html
<!-- Add to your server headers -->
Content-Security-Policy: frame-ancestors 'self' https://your-intranet.com
```

### Issue: QR code not working
**Solution:** 
1. Test the URL in a browser first
2. Ensure QR code is high quality
3. Check mobile camera permissions
4. Try a different QR scanner app

### Issue: Employee can't authenticate
**Solution:**
1. Verify Employee ID is correct (case-insensitive)
2. Check DOB format is DDMMYYYY
3. Confirm employee exists in system
4. Contact HR for password reset

---

## 🌟 Best Practices

### For HR/Admin:
1. ✅ Generate personalized links when possible
2. ✅ Use embedded mode for intranet
3. ✅ Place QR codes in high-traffic areas
4. ✅ Send reminder emails quarterly
5. ✅ Monitor update completion

### For IT:
1. ✅ Test embedded form before rollout
2. ✅ Ensure mobile responsiveness
3. ✅ Set up proper HTTPS
4. ✅ Configure Content Security Policy
5. ✅ Monitor for errors

### For Employees:
1. ✅ Keep information current
2. ✅ Use company devices when possible
3. ✅ Don't share credentials
4. ✅ Verify before saving
5. ✅ Contact HR if issues

---

## 📞 Support

### For Employees:
- **HR Support**: WhatsApp +971564966546
- **Email**: hr@yourcompany.ae
- **Help Desk**: extension 123

### For IT/Admin:
- **Technical Documentation**: See repository README
- **Issues**: Open GitHub issue
- **Customization**: Contact development team

---

## 🚀 Quick Start Checklist

- [ ] Generate update link or QR code
- [ ] Choose distribution method (embed/QR/link)
- [ ] Test with sample employee
- [ ] Deploy to production
- [ ] Communicate to employees
- [ ] Monitor adoption
- [ ] Provide support

---

**Last Updated:** February 2026  
**Version:** 1.0  
**Deployment Method:** GitHub Pages / Custom Domain
