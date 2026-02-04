# Quick Answers: Employee Update Feature

## The 3 Questions Answered

### ❓ Question 1: How does it work?

**Simple Answer:**
The app checks the URL. If it sees `?mode=update`, it shows the update form instead of the leave planner.

**Flow:**
```
1. Employee accesses URL (scan QR, click link, or visit intranet)
   ↓
2. App detects ?mode=update in URL
   ↓
3. Shows update form instead of leave planner
   ↓
4. Employee enters ID + Date of Birth
   ↓
5. Form displays with current info
   ↓
6. Employee updates contact details
   ↓
7. Changes saved
```

**Technical:**
```typescript
// In App.tsx
const isUpdateMode = urlParams.get('mode') === 'update';

if (isUpdateMode) {
  return <UpdateForm />; // Show update form
} else {
  return <LeavePlanner />; // Show normal app
}
```

---

### ❓ Question 2: How do you hide the URL?

**Simple Answer:**
You can't make the URL completely invisible in a browser, but you can make it so employees never need to type or manually handle it.

**Three Methods:**

#### 1. QR Code (Recommended for Offices)
- **Setup:** Generate QR code → Print → Display
- **Employee:** Scan → Browser opens automatically
- **URL visible?** Yes, appears in address bar after scanning
- **Why it's "hidden":** Employee never types or sees URL before scanning

#### 2. Iframe Embedding (Best for Intranet) ⭐
- **Setup:** Add iframe code to intranet page
- **Employee:** Visit intranet → Form embedded in page
- **URL visible?** No! Only intranet URL shows
- **Why it's "hidden":** Form URL is inside iframe, completely hidden

#### 3. Direct Link (For Email/WhatsApp)
- **Setup:** Generate link → Share
- **Employee:** Click link → Browser opens
- **URL visible?** Yes, full URL in address bar
- **Why it's better:** No typing, employee ID pre-filled

**Which to Use:**
- **Want URL completely hidden?** → Use iframe embedding
- **Want easy mobile access?** → Use QR code
- **Want to share digitally?** → Use direct link

---

### ❓ Question 3: What will show in the URL tab when they scan the QR?

**Exact Answer:**

```
https://yourcompany.com/?mode=update&employeeId=BAYN00002
```

**Visual:**
```
┌──────────────────────────────────────────────┐
│ 🔒 yourcompany.com/?mode=update&employeeId=..│ ← THIS
└──────────────────────────────────────────────┘
┌──────────────────────────────────────────────┐
│                                              │
│     Update Employee Details                  │
│                                              │
│  Employee ID: BAYN00002     [Pre-filled]     │
│  Date of Birth: [________]  [Enter here]     │
│                                              │
│  [Verify & Continue]                         │
│                                              │
└──────────────────────────────────────────────┘
```

**What Each Part Means:**
- `https://` → Secure
- `yourcompany.com` → Your domain
- `?mode=update` → Show update form
- `&employeeId=BAYN00002` → Pre-fill employee ID

**Is This OK?**
✅ Yes! Because:
- Employee ID is public (like a username)
- Date of Birth is the secret (like a password)
- Employee didn't type it (just scanned)
- No sensitive data in URL

---

## The Real Benefit

### What "Hidden URL" Actually Means:

**NOT:**
- ❌ URL disappears from browser
- ❌ URL is encrypted or invisible

**YES:**
- ✅ Employees never TYPE the URL
- ✅ Employees never MEMORIZE the URL
- ✅ Employees never COMMUNICATE the URL
- ✅ Professional access (scan/click)
- ✅ No typing errors
- ✅ Easy and fast

### Comparison:

**Without QR Code:**
```
HR: "Go to h-t-t-p-s colon slash slash..."
Employee: "Can you repeat that?"
HR: "Let me email it..."
Employee: "I got an error, I typed it wrong"
Result: Frustrating, slow, error-prone ❌
```

**With QR Code:**
```
HR: [Posts QR code]
Employee: [Scans]
Browser: [Opens automatically]
Result: Fast, easy, error-free ✅
```

---

## If You Want ZERO URL Visibility

**Use Iframe Embedding:**

```html
<!-- Your intranet page -->
<iframe src="https://yourcompany.com/?mode=update&embed=true" 
        width="100%" height="600"></iframe>
```

**Employee sees:**
```
Address bar: intranet.yourcompany.com/portal  ← Only this!
Form URL: Hidden inside iframe
```

**This is the ONLY way to completely hide the external URL.**

---

## Summary Table

| Method | URL After Access | Typed by Employee? | Completely Hidden? |
|--------|-----------------|-------------------|-------------------|
| **QR Code** | ✅ Visible | ❌ No | Partial |
| **Iframe** | ❌ Not visible | ❌ No | ✅ Yes |
| **Direct Link** | ✅ Visible | ❌ No (clicks) | No |

---

## Recommended Setup

### For Physical Office:
```
1. Generate QR code
2. Print poster (A4 size)
3. Display in:
   - Break room
   - Reception
   - Notice boards
4. Result: Employees scan and update
```

### For Company Intranet:
```
1. Get iframe code from admin panel
2. Give to IT department
3. They add to intranet page
4. Result: Complete URL hiding
```

### For Remote Team:
```
1. Generate personalized links
2. Send via email/WhatsApp
3. Result: Click and update
```

---

## Still Confused?

**Read These:**
- 📖 [HOW_IT_WORKS.md](./HOW_IT_WORKS.md) - Detailed explanation
- 📖 [URL_VISIBILITY_EXPLAINED.md](./URL_VISIBILITY_EXPLAINED.md) - Visual examples
- 📖 [FAQ_UPDATE_FEATURE.md](./FAQ_UPDATE_FEATURE.md) - 12 common questions

**Key Takeaway:**
> The URL will appear in the browser after QR scan (normal browser behavior), but employees never need to manually handle it. For complete URL hiding, use iframe embedding in your company intranet.

---

## Contact

- **Setup Help:** See [EMPLOYEE_UPDATE_GUIDE.md](./EMPLOYEE_UPDATE_GUIDE.md)
- **HR Support:** WhatsApp +971564966546
- **Technical Questions:** Open GitHub issue
