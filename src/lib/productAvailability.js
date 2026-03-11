export function getAvailableStock(product) {
  const numericStock = Number(product?.stock)
  if (Number.isFinite(numericStock)) {
    return Math.max(0, numericStock)
  }

  if (product?.inStock === false || product?.status === 'Sold') {
    return 0
  }

  return Number.POSITIVE_INFINITY
}

export function isProductPubliclyAvailable(product) {
  return product?.status === 'Active' && getAvailableStock(product) > 0
}

export function isProductSold(product) {
  return getAvailableStock(product) <= 0 || product?.status === 'Sold'
}
