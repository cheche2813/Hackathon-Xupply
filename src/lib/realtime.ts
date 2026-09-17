export function emitOrder(event: string, payload: any) {
  console.log(`[Realtime Order Event] ${event}:`, payload?.id || payload?.order_code || payload);
}

export function emitToUser(event: string, userId: number, payload: any) {
  console.log(`[Realtime Notification -> User ${userId}] ${event}:`, payload);
}

export function emitInventoryAlert(restaurantId: number, payload: any) {
  console.log(`[Realtime Inventory Alert -> Restaurant ${restaurantId}]:`, payload);
}
