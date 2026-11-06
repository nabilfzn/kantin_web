/**
 * Utility pemformatan mata uang Rupiah dan tanggal
 * Mengikuti standar antislop: jujur, konsisten, dan mudah dibaca.
 */

export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(amount);
}

export function formatTanggal(isoString: string): string {
  try {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  } catch {
    return isoString;
  }
}

export function formatJam(isoString: string): string {
  try {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  } catch {
    return '';
  }
}

export function validateIndonesianPhone(phone: string): boolean {
  const cleaned = phone.replace(/[\s-]/g, '');
  return /^(?:\+62|62|0)8[1-9][0-9]{7,10}$/.test(cleaned);
}


