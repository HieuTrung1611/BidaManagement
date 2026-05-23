# Self-Service Payment & Checkout Guide

## 📋 Overview

This guide explains how to handle payment and checkout for self-service sessions.

---

## 🔄 Session Lifecycle

### 1. Session Creation (Self-Service)

```
Customer → Face Scan → Recognize → Select Table → Start Session
Status: ONGOING
Payment Status: UNPAID
```

### 2. Session End (Staff at Counter)

```
Staff → End Session → Calculate Total → Process Payment
Status: COMPLETED
Payment Status: PAID/UNPAID/DEBT
```

---

## 💰 Payment Handling Options

### Option A: Payment at Counter (Recommended)

**Flow:**

1. Customer finishes playing → Goes to counter
2. Staff uses admin panel to end session
3. System calculates total (table time + products + equipment)
4. Staff processes payment (cash/card/QR)
5. Staff marks session as PAID in system
6. Print receipt if needed

**Implementation:**

- Use existing `POST /api/sessions/{id}/end` endpoint
- Add payment status update: `PUT /api/sessions/{id}/payment-status`
- Frontend: Add payment confirmation modal after end session

### Option B: Self-Checkout (Advanced)

**Flow:**

1. Customer finishes playing → Uses kiosk for checkout
2. System shows total amount breakdown
3. Customer pays via QR code / payment gateway
4. Auto-update payment status to PAID
5. Auto-end session
6. Display receipt on screen

**Requirements:**

- Payment gateway integration (VNPay, Momo, ZaloPay)
- QR code generation for payment
- Webhook to receive payment confirmation
- Auto-update payment status

---

## 🎯 Current Implementation Status

### ✅ Completed

- Self-service session creation
- Payment status tracking (PAID, UNPAID, PENDING, DEBT)
- Unpaid sessions management page
- Debt tracking with customer contact

### ⏳ To Be Implemented

- Payment status update API
- Checkout confirmation modal
- Payment gateway integration (for Option B)
- Receipt generation
- Auto-debt marking for abandoned sessions

---

## 🔧 Recommended Next Steps

### Step 1: Add Payment Status Update API

```java
// BilliardSessionService.java
SessionResponseDTO updatePaymentStatus(Long sessionId, PaymentStatus status);

// BilliardSessionController.java
@PutMapping("/{id}/payment-status")
@PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'STAFF')")
public ResponseEntity<ApiResponse<SessionResponseDTO>> updatePaymentStatus(
    @PathVariable Long id,
    @RequestParam PaymentStatus status) {
    SessionResponseDTO response = sessionService.updatePaymentStatus(id, status);
    return ResponseUtil.success(response, "Cập nhật trạng thái thanh toán thành công");
}
```

### Step 2: Enhance End Session Flow

```typescript
// When staff ends session at counter
const handleEndSession = async (sessionId: number) => {
    // 1. End session (calculates total)
    const endResult = await sessionService.endSession(sessionId);

    // 2. Show payment confirmation modal
    setShowPaymentModal(true);
    setSessionTotal(endResult.data.totalAmount);

    // 3. After payment received
    const handlePaymentConfirm = async () => {
        await sessionService.updatePaymentStatus(sessionId, "PAID");
        showToast("Thanh toán thành công!", "success");
    };
};
```

### Step 3: Auto-Mark Debt for Abandoned Sessions

```java
// Scheduled task to check unpaid sessions older than X hours
@Scheduled(cron = "0 0 * * * *") // Every hour
public void markAbandonedSessionsAsDebt() {
    LocalDateTime threshold = LocalDateTime.now().minusHours(24);

    List<BilliardSession> abandonedSessions = sessionRepository.findAll(
        (root, query, cb) -> cb.and(
            cb.equal(root.get("status"), SessionStatus.COMPLETED),
            cb.equal(root.get("paymentStatus"), PaymentStatus.UNPAID),
            cb.lessThan(root.get("endTime"), threshold)
        )
    );

    abandonedSessions.forEach(session -> {
        session.setPaymentStatus(PaymentStatus.DEBT);
        // TODO: Send SMS/Email reminder
    });

    sessionRepository.saveAll(abandonedSessions);
}
```

---

## 📊 Payment Status Transitions

```
PENDING (on start)
    ↓
UNPAID (session ongoing)
    ↓
[Session End]
    ↓
├─ PAID (payment received immediately)
├─ UNPAID (customer leaves without paying)
└─ DEBT (after 24h, auto-marked)
```

---

## 🎨 Frontend Components Needed

### 1. Payment Confirmation Modal

**Location:** `components/session/PaymentConfirmationModal.tsx`

```tsx
<PaymentConfirmationModal
    open={showPaymentModal}
    sessionId={session.id}
    totalAmount={session.totalAmount}
    customerName={session.customerName}
    onConfirm={handlePaymentConfirm}
    onCancel={handlePaymentCancel}
/>
```

### 2. Self-Checkout Kiosk Screen

**Location:** `app/(main)/self-service/checkout/page.tsx`

```tsx
// Shows session summary
// Displays QR code for payment
// Polls payment status
// Shows success/failure message
```

---

## 🔒 Security Considerations

### Payment Status Updates

- ✅ Only staff can mark as PAID
- ✅ Log all payment status changes
- ✅ Require manager approval for debt write-offs
- ✅ Prevent double-payment

### Self-Checkout

- ✅ Verify payment via webhook
- ✅ Use signed requests from payment gateway
- ✅ Timeout for pending payments
- ✅ Handle payment failures gracefully

---

## 📱 User Experience Flow

### For Customers (Self-Service)

```
1. Scan face at kiosk
2. Select table
3. Start playing
4. Go to counter when done
5. Staff calculates and processes payment
6. Receive receipt
```

### For Staff (Counter)

```
1. Customer comes to checkout
2. Find active session by table number
3. Click "End Session"
4. System shows total breakdown
5. Process payment (cash/card)
6. Click "Mark as Paid"
7. Print receipt
```

### For Managers (Debt Management)

```
1. Open "Unpaid Sessions" page
2. View list of unpaid/debt sessions
3. Call customers using displayed phone numbers
4. After payment received:
   - Mark session as PAID
   - Record payment details
```

---

## 📝 Example Scenarios

### Scenario 1: Happy Path

```
Customer → Face scan → Play → Counter → Pay → PAID
Timeline: 2 hours
Result: Payment successful, session closed
```

### Scenario 2: Customer Forgets to Pay

```
Customer → Face scan → Play → Leave without paying
Timeline: 2 hours playing, 24 hours later
Auto-Action: System marks as DEBT
Manager: Calls customer, collects payment
```

### Scenario 3: Customer Disputes Charges

```
Customer → Claims overcharge
Staff: Reviews session details
- Table time: 2.5 hours
- Products: 2 drinks, 1 snack
- Equipment: None
Staff: Explains breakdown, resolves dispute
```

---

## 🚀 Implementation Priority

### Phase 1 (Critical - Implement First)

1. ✅ Payment status update API
2. ✅ Staff payment confirmation flow
3. ✅ End session with payment modal

### Phase 2 (Important - Implement Soon)

4. Auto-mark debt for abandoned sessions
5. SMS/Email reminders for unpaid sessions
6. Receipt generation and printing

### Phase 3 (Nice to Have - Future)

7. Payment gateway integration
8. Self-checkout kiosk
9. QR code payment
10. Payment history tracking

---

## 📞 Current Workflow (Manual)

**Until Payment APIs are implemented, use this workflow:**

1. **Session Start (Self-Service):**
    - Customer uses kiosk to start session
    - `paymentStatus = UNPAID`

2. **Session End (Staff):**
    - Staff ends session via admin panel
    - System calculates total
    - Staff manually collects payment
    - Staff manually notes payment in system (or external)

3. **Debt Tracking (Manager):**
    - Manager opens `/admin/unpaid-sessions`
    - Sees list of unpaid sessions
    - Calls customers to collect payment
    - Manually records payment received

---

## ✅ Checklist for Payment Implementation

### Backend

- [ ] Create `updatePaymentStatus` API endpoint
- [ ] Add authorization checks (STAFF/MANAGER only)
- [ ] Add payment status change logging
- [ ] Implement scheduled job for auto-debt marking
- [ ] Add payment history tracking (optional)

### Frontend

- [ ] Create payment confirmation modal component
- [ ] Add payment status dropdown in session details
- [ ] Show payment status badges in session lists
- [ ] Add receipt generation (print) functionality
- [ ] Create payment history page (optional)

### Testing

- [ ] Test payment status transitions
- [ ] Test abandoned session auto-debt marking
- [ ] Test staff payment confirmation flow
- [ ] Test manager debt management workflow
- [ ] Load testing for concurrent payments

---

## 🎯 Success Metrics

- **Payment Collection Rate:** % of sessions paid vs unpaid
- **Debt Recovery Rate:** % of debt sessions eventually paid
- **Average Time to Payment:** Time between session end and payment
- **Self-Service Adoption:** % of sessions started via kiosk
- **Staff Efficiency:** Time to process payment at counter

---

For full system documentation, see:

- `SELF_SERVICE_SYSTEM_IMPLEMENTATION.md`
- `SELF_SERVICE_QUICK_REFERENCE.md`
