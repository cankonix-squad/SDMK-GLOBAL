(() => {
  const key = 'sdmk-global.hero-slides.v1';
  const settingsKey = 'sdmk-global.hero-settings.v1';
  const destinationsKey = 'sdmk-global.destinations.v1';
  const defaultDestinations = [
    ['Germany','🇩🇪','Jerman'],['Belanda','🇳🇱','Belanda'],['Inggris','🇬🇧','Inggris'],['Austria','🇦🇹','Austria'],['USA','🇺🇸','Amerika Serikat'],['Kuwait','🇰🇼','Kuwait'],['Qatar','🇶🇦','Qatar'],['Arab Saudi','🇸🇦','Arab Saudi'],['Cambodia','🇰🇭','Kamboja'],['Myanmar','🇲🇲','Myanmar'],['Singapura','🇸🇬','Singapura'],['Malaysia','🇲🇾','Malaysia'],['Taiwan','🇹🇼','Taiwan'],['Filipina','🇵🇭','Filipina'],['Jepang','🇯🇵','Jepang'],['Timor-Leste','🇹🇱','Timor-Leste'],['Australia','🇦🇺','Australia'],['Indonesia','🇮🇩','Indonesia']
  ].map(([name, flag, region]) => ({ name, flag, region, active: true, modules: ['Modul budaya negara tujuan','Etik praktik di luar negeri','Sistem kesehatan negara tujuan','Modul bahasa','Try out uji kompetensi / Prometric'] }));
  const defaultSettings = { eyebrow: 'Portal Mobilitas Global SDMK', titleBefore: 'Siapkan kompetensi. Temukan peluang.', titleAccent: 'Melangkah ke dunia.', description: 'Satu pintu informasi bagi tenaga medis dan tenaga kesehatan Indonesia untuk mengenali peluang global, mengikuti program penyiapan, dan memantau perjalanan mobilitas secara terarah.' };
  const defaults = [
    { src: 'assets/hero-sdmk-global.webp', alt: 'Pertemuan kerja sama SDM kesehatan dengan mitra internasional', title: 'Kolaborasi untuk karier kesehatan global', caption: 'Pendidikan, pelatihan, pemagangan, dan penempatan yang lebih terarah.', active: true },
    { src: 'assets/pelatihan-nakes.webp', alt: 'Pengembangan kompetensi tenaga kesehatan', title: 'Siapkan kompetensi untuk melangkah', caption: 'Program penyiapan tenaga kesehatan untuk peluang global.', active: true },
    { src: 'assets/sesi-persiapan-nakes.png', alt: 'Sesi persiapan tenaga kesehatan bersama peserta dan mitra', title: 'Bersama menyiapkan langkah global', caption: 'Sesi pembekalan dan kolaborasi untuk memperkuat kesiapan tenaga kesehatan.', active: true }
  ];
  function validSource(src) {
    return typeof src === 'string' && (/^assets\/[\w./-]+$/.test(src) && !src.includes('..') || /^https:\/\/[^\s]+$/i.test(src) || /^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/.test(src));
  }
  function validate(slides) {
    return Array.isArray(slides) && slides.length > 0 && slides.length <= 10 && slides.every(s => s && validSource(s.src) && ['alt', 'title', 'caption'].every(k => typeof s[k] === 'string' && s[k].length <= 500) && s.alt.trim() && typeof s.active === 'boolean') && slides.some(s => s.active);
  }
  window.HeroContent = {
    key, settingsKey, destinationsKey, validSource,
    loadDestinations() { try { const value = JSON.parse(localStorage.getItem(destinationsKey)); if (Array.isArray(value) && value.length) return value; } catch (_) {} return defaultDestinations.map(d => ({ ...d, modules: [...d.modules] })); },
    saveDestinations(value) { if (!Array.isArray(value) || !value.length || value.some(d => !d.name?.trim() || !d.flag?.trim() || !Array.isArray(d.modules))) throw new Error('Lengkapi negara dan modul pembekalan.'); try { localStorage.setItem(destinationsKey, JSON.stringify(value)); } catch (_) { throw new Error('Gagal menyimpan data negara.'); } },
    loadSettings() {
      try { const value = JSON.parse(localStorage.getItem(settingsKey)); if (value && Object.keys(defaultSettings).every(k => typeof value[k] === 'string' && value[k].length <= 500) && value.eyebrow.trim() && value.titleBefore.trim() && value.titleAccent.trim() && value.description.trim()) return value; } catch (_) { /* Use bundled copy when storage is unavailable. */ }
      return { ...defaultSettings };
    },
    saveSettings(value) {
      if (!value || !Object.keys(defaultSettings).every(k => typeof value[k] === 'string' && value[k].length <= 500 && value[k].trim())) throw new Error('Lengkapi semua teks Hero (maksimal 500 karakter per kolom).');
      try { localStorage.setItem(settingsKey, JSON.stringify(value)); }
      catch (_) { throw new Error('Gagal menyimpan konten Hero. Penyimpanan browser tidak tersedia atau penuh.'); }
    },
    load() {
      try { const slides = JSON.parse(localStorage.getItem(key)); if (validate(slides)) return slides; } catch (_) { /* Use bundled images when storage is unavailable. */ }
      return defaults.map(s => ({ ...s }));
    },
    save(slides) {
      if (!validate(slides)) throw new Error('Lengkapi gambar dan teks alternatif. Sisakan minimal satu slide aktif (maksimal 10 slide).');
      try { localStorage.setItem(key, JSON.stringify(slides)); }
      catch (_) { throw new Error('Gagal menyimpan. Penyimpanan browser tidak tersedia atau penuh; kurangi ukuran/jumlah gambar.'); }
    }
  };
})();
