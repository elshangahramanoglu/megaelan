export function applySmartFilters(fieldName: string, options: string[] | undefined, details: any): string[] {
  if (!options) return [];
  let filtered = [...options];

  // 1. TELEFONLAR (Phones) - Storage Logic
  if (fieldName === 'storage' && details.brand === 'Apple' && details.model) {
    const m = details.model;
    if (m.includes('15 Pro Max') || m.includes('16 Pro Max')) {
      filtered = filtered.filter(o => !['32 GB', '64 GB', '128 GB'].includes(o));
    } else if (m.includes('15') || m.includes('14') || m.includes('13') || m.includes('Pro')) {
      filtered = filtered.filter(o => !['32 GB', '64 GB'].includes(o));
    } else if (m.includes('12') || m.includes('11')) {
      filtered = filtered.filter(o => !['32 GB'].includes(o));
    }
  }

  if (fieldName === 'storage' && details.brand === 'Samsung' && details.model) {
    const m = details.model;
    if (m.includes('Ultra') || m.includes('Z Fold')) {
      filtered = filtered.filter(o => !['32 GB', '64 GB', '128 GB'].includes(o));
    }
  }

  // 2. AVTOMOBİLLƏR (Cars) - Engine Size Logic
  if (fieldName === 'engine' && details.brand) {
    if (details.brand === 'LADA (VAZ)') {
      filtered = filtered.filter(o => parseFloat(o) <= 2.0 || o === 'Elektrik');
    }
    if (details.brand === 'BMW' && details.model) {
      const m = details.model;
      if (m.includes('X5') || m.includes('X6') || m.includes('X7') || m.includes('7 Series')) {
        filtered = filtered.filter(o => parseFloat(o) >= 3.0);
      }
    }
    if (details.brand === 'Mercedes' && details.model) {
      const m = details.model;
      if (m.includes('G-Class') || m.includes('S-Class') || m.includes('GLS')) {
        filtered = filtered.filter(o => parseFloat(o) >= 3.0);
      }
    }
    if (details.brand === 'Toyota' && details.model) {
      if (details.model.includes('Land Cruiser') || details.model.includes('Prado')) {
        filtered = filtered.filter(o => parseFloat(o) >= 2.7);
      }
    }
  }

  // 3. DAŞINMAZ ƏMLAK (Real Estate) - Rooms Logic
  if (fieldName === 'rooms' && details.subCategory === 'Qarajlar') {
    // Garages usually don't have 6+ rooms
    filtered = filtered.filter(o => ['1', '2'].includes(o));
  }

  // 4. İŞ ELANLARI (Jobs) - Experience Logic
  if (fieldName === 'experience' && details.subCategory === 'Təcrübə proqramları') {
    // Internships usually require less experience
    filtered = filtered.filter(o => ['Təcrübəsiz', '1 ildən aşağı'].includes(o));
  }

  return filtered;
}
