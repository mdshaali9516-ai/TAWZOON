# Implementation Plan - Telegram Bot Order Notifications & Sync

## User Goal
The user wants orders placed on the website (both public and reseller orders) to be automatically sent to their Telegram bot (Token: `8930732230:AAHFCaoKMW419YiJc0jMIwE1DBZQHeJQ2qs`) along with product images and details. The Telegram message should contain interactive inline buttons (**"✅ অর্ডার কনফার্ম করুন"** and **"❌ অর্ডার বাতিল করুন"**) that update the order status in the Admin Panel in real time.

## Proposed Changes

### 1. Admin Portal Settings (`src/components/AdminPortal.tsx`)
- Ensure both **Telegram Bot Token** and **Telegram Chat ID** input fields are clearly visible in the Public Editing System / Settings section.
- Allow the user to save both settings to `brandSettings`.

### 2. Backend Notification & Webhook Poller (`server.ts`)
- Update `sendTelegramOrderNotification` to accept both `telegramBotToken` and `telegramChatId`.
- Add robust error logging if `chatId` or `token` is missing.
- Ensure the background poller (`pollTelegramUpdates`) correctly processes callback queries for order confirmation and cancellation, updating `saleStatus` in `state.sales` and editing the Telegram message.

## Verification Plan
- Verify compilation with `compile_applet`.
- Verify Telegram settings save correctly in Admin Portal.
