export function formatPrice(price: number, type: 'sale' | 'rent'): string {
  const formatted = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price);

  if (type === 'rent') {
    return `${formatted}/mo`;
  }

  if (price >= 10000000) {
    return `₹${(price / 10000000).toFixed(2).replace(/\.00$/, '')} Cr`;
  }
  if (price >= 100000) {
    return `₹${(price / 100000).toFixed(2).replace(/\.00$/, '')} L`;
  }

  return formatted;
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
