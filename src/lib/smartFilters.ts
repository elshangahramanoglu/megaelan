export function applySmartFilters(fieldName: string, options: string[] | undefined, details: any): string[] {
  if (!options) return [];
  let filtered = [...options];

  
  // 1. TELEFONLAR (Phones) - Color Logic
  if (fieldName === 'color' && details.brand && details.model) {
    const m = details.model;
    
    // Apple Colors
    if (details.brand === 'Apple') {
      if (m.includes('18 Pro')) {
        filtered = ['Titan Qara', 'Titan Ağ', 'Təbii Titan', 'Tunc Titan', 'Digər'];
      } else if (m.includes('16 Pro') || m.includes('17 Pro')) {
        filtered = ['Titan Qara', 'Titan Ağ', 'Təbii Titan', 'Çöl Titan', 'Digər'];
      } else if (m.includes('15 Pro')) {
        filtered = ['Titan Qara', 'Titan Ağ', 'Təbii Titan', 'Mavi Titan', 'Digər'];
      } else if (m.includes('15') || m.includes('16') || m.includes('17') || m.includes('18')) {
        filtered = ['Qara', 'Mavi', 'Çəhrayı', 'Sarı', 'Yaşıl', 'Ağ', 'Digər'];
      } else if (m.includes('14 Pro') || m.includes('13 Pro') || m.includes('12 Pro')) {
        filtered = ['Qara', 'Gümüşü', 'Qızılı', 'Bənövşəyi', 'Mavi', 'Qrafit', 'Digər'];
      } else {
        filtered = ['Qara', 'Ağ', 'Qırmızı', 'Mavi', 'Yaşıl', 'Sarı', 'Bənövşəyi', 'Çəhrayı', 'Digər'];
      }
    }
    
    // Samsung Colors
    if (details.brand === 'Samsung') {
      if (m.includes('S24 Ultra') || m.includes('S25 Ultra') || m.includes('S26 Ultra')) {
        filtered = ['Titan Qara', 'Titan Ağ', 'Sarı', 'Bənövşəyi', 'Boz', 'Digər'];
      } else if (m.includes('S23') || m.includes('S24')) {
        filtered = ['Qara', 'Ağ', 'Bej', 'Yaşıl', 'Bənövşəyi', 'Sarı', 'Digər'];
      } else {
        filtered = ['Qara', 'Ağ', 'Göy', 'Boz', 'Yaşıl', 'Qırmızı', 'Digər'];
      }
    }
  }

  // 1.5 TELEFONLAR - Processor Logic
  if (fieldName === 'processor' && details.brand) {
    if (details.brand === 'Apple') {
      filtered = filtered.filter(o => o.includes('Apple'));
      // More accurate mapping
      if (details.model) {
        const m = details.model;
        if (m.includes('18 Pro')) filtered = ['Apple A20 Pro', 'Digər'];
        else if (m.includes('18')) filtered = ['Apple A19 Pro', 'Digər']; // base 18 uses A19 Pro usually or A19
        else if (m.includes('17 Pro')) filtered = ['Apple A19 Pro', 'Digər'];
        else if (m.includes('17')) filtered = ['Apple A18 Pro', 'Digər'];
        else if (m.includes('16 Pro')) filtered = ['Apple A18 Pro', 'Digər'];
        else if (m.includes('15 Pro')) filtered = ['Apple A17 Pro', 'Digər'];
        else if (m.includes('MacBook') || m.includes('iPad')) {
          filtered = filtered.filter(o => o.includes('M')); // M1, M2, M3, M4, M5
        }
      }
    } else {
      filtered = filtered.filter(o => !o.includes('Apple'));
    }
  }


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
