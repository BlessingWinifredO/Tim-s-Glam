import { doc, runTransaction, serverTimestamp } from 'firebase/firestore'

export async function applyInventoryAdjustmentForCompletedOrder(db, orderId, order, newStatus, force = false) {
  const previousStatus = order?.status || ''
  const alreadyAdjusted = Boolean(order?.inventoryAdjusted)

  // When force=true (reconcile case) skip the previousStatus check but still skip if already adjusted.
  if (alreadyAdjusted) {
    return { inventoryAdjusted: true }
  }
  if (!force && (newStatus !== 'Completed' || previousStatus === 'Completed')) {
    return { inventoryAdjusted: false }
  }

  const orderRef = doc(db, 'orders', orderId)

  await runTransaction(db, async (transaction) => {
    const latestOrderSnap = await transaction.get(orderRef)
    if (!latestOrderSnap.exists()) {
      throw new Error('Order no longer exists')
    }

    const latestOrder = latestOrderSnap.data()
    if (latestOrder?.inventoryAdjusted) {
      return
    }

    for (const item of latestOrder.items || []) {
      if (!item?.productId) continue
      const quantity = Number(item.quantity || 0)
      if (!quantity) continue

      const productRef = doc(db, 'products', item.productId)
      const productSnap = await transaction.get(productRef)
      if (!productSnap.exists()) continue

      const product = productSnap.data()
      const currentStock = Number(product?.stock)
      if (!Number.isFinite(currentStock)) continue

      const nextStock = Math.max(0, currentStock - quantity)
      transaction.update(productRef, {
        stock: nextStock,
        inStock: nextStock > 0,
        status: nextStock > 0 ? (product?.status === 'Sold' ? 'Active' : (product?.status || 'Active')) : 'Sold',
        updatedAt: serverTimestamp(),
      })
    }

    transaction.update(orderRef, {
      status: newStatus,
      inventoryAdjusted: true,
      inventoryAdjustedAt: serverTimestamp(),
    })
  })

  return { inventoryAdjusted: true }
}
