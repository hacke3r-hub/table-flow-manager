# Restaurant Dashboard Enhancement Plan

## 1. Type Definitions (`src/types/index.ts`)
- Enhance `Order` interface:
  - Add `preparationTime: number` (estimated total minutes).
  - Add `assignedWaiterId: string`.
- Ensure `OrderStatus` includes `pending`, `preparing`, `ready`, and `served`.

## 2. State Management (`src/store/RestaurantContext.tsx`)
- Update `placeOrder`:
  - Automatically assign the table's current `waiterId` to the order.
  - Set a default `preparationTime` (e.g., 20 mins).
- Update `updateOrderStatus`:
  - Handle transitions and ensure state consistency.

## 3. Admin Dashboard (`src/views/AdminView.tsx`)
- Enhance the summary cards:
  - Available Tables count.
  - Active Waiters count.
  - Average Prep Time.
- Add a "Pending Tables" section:
  - List tables with active orders.
  - Show the assigned waiter and the remaining/estimated prep time.
- Add a "Kitchen Progress" section:
  - Show a list of orders currently in the 'preparing' status.

## 4. Kitchen Monitor (`src/views/KitchenView.tsx`)
- Group orders by status:
  - **New Orders** (Pending)
  - **In Preparation** (Preparing)
  - **Ready for Pickup** (Ready)
- Update Order Cards:
  - Display the Assigned Waiter's name clearly.
  - Display the Table Number (already present, but ensure it's prominent).
- Add status-based filtering or sections for better organization.

## 5. UI/UX Refinements
- Use `lucide-react` icons for status indicators.
- Apply consistent color coding (Green for Available/Ready, Blue for Occupied, Amber for Preparing, Red for Pending/Urgent).
- Ensure responsiveness for all views.
