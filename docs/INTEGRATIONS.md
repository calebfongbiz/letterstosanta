# Letters to Santa™ - Integration Documentation

This document describes the API endpoints and webhook integrations for connecting Letters to Santa with Make.com (formerly Integromat) or other automation platforms.

## Overview

The Letters to Santa application uses two types of integrations:

1. **Outbound Webhooks** - Data sent FROM our app TO Make.com when events occur
2. **Inbound API Calls** - Data sent FROM Make.com TO our app to update tracker status

## Environment Variables

Configure these in your `.env` file:

```env
# URL that receives new order notifications
MAKE_WEBHOOK_NEW_ORDER="https://hook.make.com/your-webhook-id-here"

# Secret for authenticating Make.com webhook calls to our API
MAKE_WEBHOOK_SECRET="your-secure-random-secret-here"
```

---

## 1. Outbound Webhook: New Order Created

**Triggered:** When a customer submits a letter order  
**Endpoint:** `POST {MAKE_WEBHOOK_NEW_ORDER}`  
**Direction:** App → Make.com

### Payload Structure

```json
{
  "orderId": "clx1234567890",
  "customer": {
    "id": "clx1234567890",
    "firstName": "John",
    "lastName": "Smith",
    "email": "john.smith@example.com"
  },
  "tier": "EXPERIENCE",
  "extraChildrenCount": 1,
  "totalPrice": 32.98,
  "children": [
    {
      "id": "clx_child_001",
      "name": "Emma",
      "age": 7,
      "trackerId": "abc123xyz789",
      "trackerUrl": "https://letterstosanta.com/track/abc123xyz789",
      "letter": {
        "id": "clx_letter_001",
        "letterText": "Dear Santa, I have been very good this year...",
        "wishlist": "A unicorn toy, art supplies, and a puppy",
        "goodThings": "I helped my little brother learn to ride a bike",
        "petsAndFamily": "I have a cat named Whiskers and a brother named Max",
        "photoUrl": null
      }
    },
    {
      "id": "clx_child_002",
      "name": "Max",
      "age": 5,
      "trackerId": "def456uvw123",
      "trackerUrl": "https://letterstosanta.com/track/def456uvw123",
      "letter": {
        "id": "clx_letter_002",
        "letterText": "Dear Santa, I want a fire truck...",
        "wishlist": "Fire truck, dinosaurs",
        "goodThings": "I shared my toys with Emma",
        "petsAndFamily": "My cat Whiskers is fluffy",
        "photoUrl": null
      }
    }
  ],
  "createdAt": "2024-11-15T10:30:00.000Z"
}
```

### Field Descriptions

| Field | Type | Description |
|-------|------|-------------|
| `orderId` | string | Unique identifier for the order (same as customer.id) |
| `customer.id` | string | Customer's unique ID |
| `customer.firstName` | string | Parent's first name |
| `customer.lastName` | string | Parent's last name |
| `customer.email` | string | Parent's email address |
| `tier` | enum | One of: `FREE`, `TRACKER`, `EXPERIENCE` |
| `extraChildrenCount` | number | Number of children beyond the first |
| `totalPrice` | number | Total order price in USD |
| `children[].id` | string | Child's unique ID |
| `children[].name` | string | Child's first name |
| `children[].age` | number | Child's age (1-18) |
| `children[].trackerId` | string | Unique tracker ID for this child |
| `children[].trackerUrl` | string | Full URL to view this child's tracker |
| `children[].letter.letterText` | string | The main letter content |
| `children[].letter.wishlist` | string? | Christmas wishlist (optional) |
| `children[].letter.goodThings` | string? | Good deeds mentioned (optional) |
| `children[].letter.petsAndFamily` | string? | Family/pet info (optional) |
| `children[].letter.photoUrl` | string? | Uploaded photo URL (optional) |
| `createdAt` | string | ISO 8601 timestamp |

### Make.com Scenario Suggestions

When receiving this webhook in Make.com, you can:

1. **Send confirmation email** to the customer
2. **Schedule daily elf update emails** for each child
3. **Generate AI Santa letter** for EXPERIENCE tier
4. **Generate Nice List certificate** for EXPERIENCE tier
5. **Store data** in Google Sheets or Airtable for tracking
6. **Trigger payment processing** integration

---

## 2. Inbound API: Update Tracker Status

**Endpoint:** `POST /api/tracker/update`  
**Direction:** Make.com → App  
**Authentication:** Header `x-make-secret: {MAKE_WEBHOOK_SECRET}`

### Request Structure

```json
{
  "trackerId": "abc123xyz789",
  "milestone": "CANDY_CANE_FOREST",
  "milestoneIndex": 1,
  "storyText": "Your letter is now traveling through the enchanted Candy Cane Forest! The sweet scent of peppermint fills the air...",
  "santaLetterPdfUrl": "https://storage.example.com/santa-letters/abc123.pdf",
  "niceListCertificateUrl": "https://storage.example.com/certificates/abc123.pdf"
}
```

### Request Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `trackerId` | string | ✅ | The child's unique tracker ID |
| `milestone` | enum | ✅ | Current milestone location |
| `milestoneIndex` | number | ❌ | Index 0-5 (calculated if not provided) |
| `storyText` | string | ❌ | Story text to display on tracker |
| `santaLetterPdfUrl` | string | ❌ | URL to Santa's reply PDF |
| `niceListCertificateUrl` | string | ❌ | URL to Nice List certificate PDF |

### Milestone Values (in order)

| Index | Milestone Value | Display Name |
|-------|-----------------|--------------|
| 0 | `ELF_SORTING_STATION` | Elf Sorting Station |
| 1 | `CANDY_CANE_FOREST` | Candy Cane Forest |
| 2 | `REINDEER_RUNWAY` | Reindeer Runway |
| 3 | `AURORA_GATE` | Aurora Gate |
| 4 | `SANTAS_DESK` | Santa's Desk |
| 5 | `NORTH_POLE_WORKSHOP` | North Pole Workshop |

### Response (Success)

```json
{
  "success": true,
  "trackerId": "abc123xyz789",
  "milestone": "CANDY_CANE_FOREST",
  "milestoneIndex": 1,
  "child": {
    "id": "clx_child_001",
    "name": "Emma",
    "currentMilestone": "CANDY_CANE_FOREST",
    "milestoneIndex": 1,
    "currentStoryText": "Your letter is now traveling...",
    "letter": {
      "santaLetterPdfUrl": "https://...",
      "niceListCertificateUrl": "https://..."
    },
    "customer": {
      "firstName": "John",
      "lastName": "Smith",
      "email": "john@example.com",
      "tier": "EXPERIENCE"
    }
  }
}
```

### Response (Error)

```json
{
  "error": "Tracker not found"
}
```

### cURL Example

```bash
curl -X POST https://your-domain.com/api/tracker/update \
  -H "Content-Type: application/json" \
  -H "x-make-secret: your-secret-here" \
  -d '{
    "trackerId": "abc123xyz789",
    "milestone": "CANDY_CANE_FOREST",
    "storyText": "Your letter is traveling through the magical forest..."
  }'
```

---

## 3. Suggested Make.com Workflow

### Daily Tracker Progression

Create a scheduled Make.com scenario that runs daily to progress letters:

1. **Get all children** that need progression (from your tracking spreadsheet/database)
2. **For each child:**
   - Calculate the next milestone based on days since order
   - Generate personalized story text (consider using ChatGPT module)
   - Call `/api/tracker/update` to progress the tracker
   - Send elf email update to parent

### Santa Letter Generation (for EXPERIENCE tier)

When a letter reaches `SANTAS_DESK` milestone:

1. **Trigger ChatGPT** to generate personalized Santa response
2. **Use PDF generation** service to create beautiful letter
3. **Upload PDF** to cloud storage
4. **Call `/api/tracker/update`** with `santaLetterPdfUrl`
5. **Generate Nice List certificate** similarly
6. **Progress to final milestone** `NORTH_POLE_WORKSHOP`

### Email Notifications

Integrate with SendGrid, Mailchimp, or similar for:

- Order confirmation email
- Daily elf story updates
- Santa letter ready notification
- Journey complete celebration

---

## 4. Security Notes

1. **Never expose `MAKE_WEBHOOK_SECRET`** in client-side code
2. **Always validate** the `x-make-secret` header in your API
3. **Use HTTPS** for all webhook URLs
4. **Rotate secrets** periodically
5. **Log webhook failures** for debugging

---

## 5. Testing

### Test the Tracker Update API

```bash
# Health check
curl https://your-domain.com/api/tracker/update

# Test update (replace with real values)
curl -X POST https://your-domain.com/api/tracker/update \
  -H "Content-Type: application/json" \
  -H "x-make-secret: dev-secret-change-in-production" \
  -d '{
    "trackerId": "your-test-tracker-id",
    "milestone": "CANDY_CANE_FOREST",
    "storyText": "Test story text"
  }'
```

---

## 6. Troubleshooting

| Issue | Solution |
|-------|----------|
| 401 Unauthorized | Check `x-make-secret` header matches `MAKE_WEBHOOK_SECRET` |
| 404 Tracker not found | Verify `trackerId` exists in database |
| 400 Invalid milestone | Use exact enum values (e.g., `CANDY_CANE_FOREST`) |
| Webhook not received | Check `MAKE_WEBHOOK_NEW_ORDER` URL is correct |

---

## Questions?

For integration support, refer to the main application documentation or contact the development team.
