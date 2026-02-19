export type CartItem = { productId: string; quantity: number };

const KEY = "cart";

export function loadCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveCart(items: CartItem[]) {
  localStorage.setItem(KEY, JSON.stringify(items));
}

export function addToCart(productId: string, maxStock: number) {
  const cart = loadCart();
  const existing = cart.find((c) => c.productId === productId);

  if (!existing) {
    if (maxStock <= 0) return cart;
    cart.push({ productId, quantity: 1 });
  } else {
    existing.quantity = Math.min(existing.quantity + 1, maxStock);
  }

  saveCart(cart);
  return cart;
}

export function setQty(productId: string, quantity: number, maxStock: number) {
  const cart = loadCart();
  const item = cart.find((c) => c.productId === productId);
  if (!item) return cart;

  item.quantity = Math.max(1, Math.min(quantity, maxStock));
  saveCart(cart);
  return cart;
}

export function removeFromCart(productId: string) {
  const cart = loadCart().filter((c) => c.productId !== productId);
  saveCart(cart);
  return cart;
}

export function clearCart() {
  saveCart([]);
}
