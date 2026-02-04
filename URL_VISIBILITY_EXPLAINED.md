# Visual Guide: What Appears in the Browser

## 📱 QR Code Scanning - Step by Step

### What the Employee Sees

#### Step 1: Physical QR Code
```
                 OFFICE WALL / NOTICE BOARD
    ┌─────────────────────────────────────────────┐
    │                                             │
    │        UPDATE YOUR CONTACT DETAILS          │
    │                                             │
    │         ┌─────────────────────┐             │
    │         │  ▄▄▄▄▄ █▀▀ ▄▄▄▄▄   │             │
    │         │  █   █ ██▀ █   █   │             │
    │         │  █▄▄▄█ ▄ █ █▄▄▄█   │             │
    │         │  ▄▄▄▄▄ █ ▀ ▄▄▄▄▄   │             │
    │         │  ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀   │             │
    │         └─────────────────────┘             │
    │                                             │
    │         SCAN WITH YOUR PHONE                │
    │         TO ACCESS THE FORM                  │
    │                                             │
    └─────────────────────────────────────────────┘
```

**Employee thinks:** "I'll scan this to update my details"
**Employee does NOT see:** Any URL at this point

---

#### Step 2: Phone Camera Scanning
```
    ┌────────────────────────────┐
    │    📱 EMPLOYEE'S PHONE     │
    │                            │
    │    ┌──────────────────┐   │
    │    │                  │   │
    │    │  [CAMERA VIEW]   │   │
    │    │                  │   │
    │    │   ████████████   │   │
    │    │   █SCANNING...█  │   │
    │    │   ████████████   │   │
    │    │                  │   │
    │    └──────────────────┘   │
    │                            │
    │  Notification appears:     │
    │  ┌──────────────────────┐ │
    │  │ Open in Safari       │ │
    │  │ yourcompany.com      │ │ ← Domain visible here
    │  └──────────────────────┘ │
    │                            │
    └────────────────────────────┘
```

**Employee thinks:** "I'll tap this notification"
**Employee sees:** Domain name in notification, not full URL

---

#### Step 3: Browser Opens - THIS IS WHAT THEY SEE
```
    ┌────────────────────────────────────────────────┐
    │  📱 Mobile Browser                             │
    ├────────────────────────────────────────────────┤
    │  ◀  🔒  yourcompany.com/?mode=update&em...  ⋮  │ ← ADDRESS BAR
    ├────────────────────────────────────────────────┤
    │                                                │
    │           Update Employee Details              │
    │    Keep your contact information up to date    │
    │                                                │
    │  ┌──────────────────────────────────────────┐ │
    │  │  🔒 Secure Access                        │ │
    │  │                                          │ │
    │  │  Your employee details are protected.    │ │
    │  │  Enter your credentials to access the    │ │
    │  │  update form.                            │ │
    │  │                                          │ │
    │  │  Employee ID                             │ │
    │  │  ┌────────────────────────┐              │ │
    │  │  │ BAYN00002              │ ← PRE-FILLED │ │
    │  │  └────────────────────────┘              │ │
    │  │                                          │ │
    │  │  Date of Birth                           │ │
    │  │  ┌────────────────────────┐              │ │
    │  │  │                        │              │ │
    │  │  └────────────────────────┘              │ │
    │  │  Format: DDMMYYYY (e.g., 15031990)      │ │
    │  │                                          │ │
    │  │       [ ✓ Verify & Continue ]           │ │
    │  │                                          │ │
    │  └──────────────────────────────────────────┘ │
    │                                                │
    └────────────────────────────────────────────────┘
```

**What Shows in Address Bar:**
```
https://yourcompany.com/?mode=update&employeeId=BAYN00002
```

**Employee sees:** 
- ✅ The form interface (main focus)
- ✅ Pre-filled Employee ID
- ✅ URL in address bar (small, at top)

**Employee doesn't need to:**
- ❌ Type the URL
- ❌ Remember the URL
- ❌ Share the URL with others

---

## 💻 Iframe Embedding - Complete URL Hiding

### Scenario: Company Intranet

#### What IT Does:
```html
<!-- File: https://intranet.yourcompany.com/employee-portal.html -->

<html>
<body>
  <h1>Employee Self-Service Portal</h1>
  
  <iframe 
    src="https://yourcompany.com/?mode=update&embed=true"
    width="100%"
    height="600"
    frameborder="0">
  </iframe>
  
</body>
</html>
```

#### What Employee Sees:
```
    ┌────────────────────────────────────────────────────┐
    │  💻 Desktop Browser                                │
    ├────────────────────────────────────────────────────┤
    │  ← →  🔒  intranet.yourcompany.com/employee-portal │ ← INTRANET URL
    ├────────────────────────────────────────────────────┤
    │                                                    │
    │  Employee Self-Service Portal                      │
    │  ═══════════════════════════════════════════       │
    │                                                    │
    │  ┌──────────────────────────────────────────────┐ │
    │  │  EMBEDDED UPDATE FORM                        │ │
    │  │  ╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌      │ │
    │  │                                              │ │
    │  │  Employee Verification                       │ │
    │  │  Enter your credentials to update details    │ │
    │  │                                              │ │
    │  │  Employee ID:  ┌──────────────┐             │ │
    │  │                │ BAYN00002    │             │ │
    │  │                └──────────────┘             │ │
    │  │                                              │ │
    │  │  Date of Birth: ┌──────────────┐            │ │
    │  │                 │              │            │ │
    │  │                 └──────────────┘            │ │
    │  │                                              │ │
    │  │         [ Verify & Continue ]                │ │
    │  │                                              │ │
    │  └──────────────────────────────────────────────┘ │
    │                                                    │
    └────────────────────────────────────────────────────┘
```

**What Shows in Address Bar:**
```
https://intranet.yourcompany.com/employee-portal
```

**The actual form URL is HIDDEN:**
```
https://yourcompany.com/?mode=update&embed=true  ← HIDDEN!
```

**Employee sees:**
- ✅ Only the intranet URL
- ✅ Form looks like part of intranet
- ✅ Seamless experience

**Employee doesn't see:**
- ❌ External form URL
- ❌ Query parameters
- ❌ Any indication it's external

---

## 🔗 Direct Link - Clear View

### Scenario: Email/WhatsApp

#### What HR Sends:
```
From: HR Department
To: employee@company.com
Subject: Update Your Contact Details

Hi Team,

Please take a moment to update your contact information:

👉 https://yourcompany.com/?mode=update&employeeId=BAYN00002

You'll need your Date of Birth to verify your identity.

Thanks,
HR Team
```

#### What Employee Sees After Clicking:
```
    ┌────────────────────────────────────────────────────┐
    │  💻 Browser                                        │
    ├────────────────────────────────────────────────────┤
    │  🔒  yourcompany.com/?mode=update&employeeId=BAYN00002  │ ← FULL URL
    ├────────────────────────────────────────────────────┤
    │                                                    │
    │         Update Employee Details                     │
    │    Keep your contact information up to date        │
    │                                                    │
    │  [Form appears here with Employee ID pre-filled]   │
    │                                                    │
    └────────────────────────────────────────────────────┘
```

**What Shows in Address Bar:**
```
https://yourcompany.com/?mode=update&employeeId=BAYN00002
```

**Benefits even though URL is visible:**
- ✅ Employee just clicks (no typing)
- ✅ Employee ID pre-filled
- ✅ Less chance of errors
- ✅ Faster access

---

## 📊 Side-by-Side Comparison

### Address Bar Content Comparison

```
METHOD 1: QR CODE
┌────────────────────────────────────────────┐
│ yourcompany.com/?mode=update&employeeId=...│ ← VISIBLE but not typed
└────────────────────────────────────────────┘

METHOD 2: IFRAME EMBEDDING
┌────────────────────────────────────────────┐
│ intranet.yourcompany.com/employee-portal   │ ← INTRANET URL ONLY!
└────────────────────────────────────────────┘
Actual form URL: Hidden inside iframe

METHOD 3: DIRECT LINK
┌────────────────────────────────────────────┐
│ yourcompany.com/?mode=update&employeeId=...│ ← VISIBLE and clickable
└────────────────────────────────────────────┘
```

---

## 🎯 URL Visibility Levels

### Complete Comparison Chart

| Aspect | QR Code | Iframe Embed | Direct Link |
|--------|---------|--------------|-------------|
| **URL in Address Bar** | ✅ Yes | ❌ No (intranet URL) | ✅ Yes |
| **Employee Types URL** | ❌ No | ❌ No | ❌ No (clicks) |
| **URL Parameters Visible** | ✅ Yes | ❌ No | ✅ Yes |
| **Professional Appearance** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| **Ease of Setup** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **URL "Hidden" Level** | Partial | Complete | Minimal |

---

## 💡 Understanding "Hidden URL"

### What "Hidden URL" MEANS:
- ❌ NOT: URL magically disappears from browser
- ✅ YES: Employee never needs to handle URL manually
- ✅ YES: No typing, memorizing, or communicating URL
- ✅ YES: Professional access method (scan/click/navigate)

### What "Hidden URL" DOESN'T MEAN:
- ❌ URL is invisible in browser (impossible)
- ❌ URL is encrypted or obfuscated
- ❌ URL cannot be seen by anyone

### The Real Benefit:
```
WITHOUT QR CODE:
HR: "Go to h-t-t-p-s colon slash slash yourcompany dot com 
     slash question mark mode equals update ampersand..."
Employee: "Wait, can you repeat that?"
HR: "Let me email it to you..."
Employee: "I got a 404 error, I think I typed it wrong"
❌ Complex, error-prone, frustrating

WITH QR CODE:
HR: [Posts QR code on wall]
Employee: [Scans with phone]
Browser: [Opens automatically]
✅ Simple, fast, error-free
```

---

## 🔍 Real Mobile Screenshots Simulation

### iPhone After QR Scan

```
╔════════════════════════════════════════╗
║ ◁  yourcompany.com/?mode=update&...  ⋮║ ← Address bar (small, top)
╠════════════════════════════════════════╣
║                                        ║
║                                        ║
║      Update Employee Details           ║ ← Main focus
║                                        ║
║ ┌────────────────────────────────────┐ ║
║ │ 🔐 Secure Access                   │ ║
║ │                                    │ ║
║ │ Your employee details are          │ ║
║ │ protected. Enter credentials.      │ ║
║ │                                    │ ║
║ │ Employee ID                        │ ║
║ │ ┌────────────────┐                 │ ║
║ │ │ BAYN00002     │                  │ ║
║ │ └────────────────┘                 │ ║
║ │                                    │ ║
║ │ Date of Birth                      │ ║
║ │ ┌────────────────┐                 │ ║
║ │ │                │                 │ ║
║ │ └────────────────┘                 │ ║
║ │                                    │ ║
║ │  [ Verify & Continue ]             │ ║
║ │                                    │ ║
║ └────────────────────────────────────┘ ║
║                                        ║
║                                        ║
╚════════════════════════════════════════╝
```

**Key Observation:**
- Address bar is small at top (typical browser UI)
- Main screen shows the form (what employee focuses on)
- URL is there but not the primary focus
- Employee didn't type it, so no confusion

---

## 📱 Android After QR Scan

```
┌─────────────────────────────────────────┐
│ ←  yourcompany.com/?mode=update&em... ⋮ │ ← Address bar
├─────────────────────────────────────────┤
│                                         │
│       Update Employee Details           │
│                                         │
│  ┌───────────────────────────────────┐  │
│  │  🔒 Secure Access                 │  │
│  │                                   │  │
│  │  Enter your credentials           │  │
│  │                                   │  │
│  │  Employee ID: BAYN00002           │  │
│  │  Date of Birth: [________]        │  │
│  │                                   │  │
│  │  [Verify & Continue]              │  │
│  └───────────────────────────────────┘  │
│                                         │
└─────────────────────────────────────────┘
```

---

## ✅ Summary: What They Actually See

### QR Code Method
1. **Physical QR Code:** No URL visible ✅
2. **Scanning:** Domain shown in notification ✅
3. **Browser Opens:** Full URL in address bar (but not typed) ✅

### Iframe Method
1. **Intranet Page:** Only intranet URL ✅
2. **Embedded Form:** No external URL visible ✅
3. **Complete Experience:** Looks internal ✅

### Direct Link Method
1. **Receive Link:** URL visible in message ✅
2. **Click Link:** Browser opens with URL ✅
3. **Form Access:** Pre-filled, quick ✅

---

## 🎓 Final Takeaway

**The "Hidden URL" Concept Means:**

> Employees access the form through **professional methods** (QR codes, embedded forms, or direct links) without needing to **manually handle, type, or communicate** complex URLs.

**For QR Codes specifically:**
- ✅ URL **is encoded** in QR code (not visible)
- ✅ URL **appears in browser** after scan (normal behavior)
- ✅ Employee **never types** or sees URL before scanning
- ✅ **Professional** and **error-free** access method

**For Complete URL Hiding:**
- Use **iframe embedding** in company intranet
- Employee only sees intranet URL
- Form URL completely hidden inside iframe
