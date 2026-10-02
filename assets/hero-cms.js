(() => {
  window.HeroCMS = { mount(container) {
    let slides = HeroContent.load();
    let pending = 0;
    const settings = HeroContent.loadSettings();
    let destinations = HeroContent.loadDestinations();
    container.innerHTML = `<div class="cms-toolbar"><button type="button" class="cms-save">Simpan perubahan</button><button type="button" class="cms-add">+ Tambah slide</button><a href="landing-page.html" target="_blank" rel="noopener">Lihat halaman utama ↗</a></div><section class="cms-hero-settings"><h3>Hero halaman utama</h3><p class="cms-note">Kelola teks yang tampil di bagian pembuka landing page.</p><div class="cms-settings-grid"><label>Label atas<input data-setting="eyebrow" maxlength="500" value=""></label><label>Judul utama<input data-setting="titleBefore" maxlength="500" value=""></label><label>Judul berwarna<input data-setting="titleAccent" maxlength="500" value=""></label><label>Deskripsi<textarea data-setting="description" maxlength="500"></textarea></label></div><button type="button" class="cms-save-settings">Simpan konten Hero</button></section><section class="cms-hero-settings"><h3>Negara & modul pembekalan</h3><p class="cms-note">Edit nama negara, kode bendera emoji, dan daftar modul. Pisahkan modul dengan tanda koma.</p><div class="cms-destination-editor"></div><button type="button" class="cms-save-destinations">Simpan negara & modul</button></section><p class="cms-note">Atur hingga 10 slide. Gunakan gambar JPG, PNG, atau WebP (maksimal 1 MB per gambar), atau URL HTTPS. Minimal satu slide harus aktif.</p><p class="cms-note">Pratinjau lokal: perubahan tersimpan di browser ini. Publikasi ke semua pengunjung memerlukan koneksi CMS ke server.</p><div class="cms-status" role="status" aria-live="polite"></div><div class="cms-list"></div>`;
    Object.entries(settings).forEach(([key, value]) => { const input = container.querySelector(`[data-setting="${key}"]`); if (input) input.value = value; });
    const list = container.querySelector('.cms-list');
    const status = container.querySelector('.cms-status');
    const destinationEditor = container.querySelector('.cms-destination-editor');
    destinations.forEach((d, i) => { const row = document.createElement('div'); row.className = 'cms-destination-row'; row.innerHTML = `<input data-destination="name" value="" maxlength="80"><input data-destination="flag" value="" maxlength="4" aria-label="Bendera"><input data-destination="modules" value="" maxlength="600" aria-label="Modul pembekalan"><label><input data-destination="active" type="checkbox"> Aktif</label>`; row.querySelector('[data-destination="name"]').value = d.name; row.querySelector('[data-destination="flag"]').value = d.flag; row.querySelector('[data-destination="modules"]').value = d.modules.join(', '); row.querySelector('[data-destination="active"]').checked = d.active; row.querySelectorAll('input').forEach(input => input.addEventListener('input', dirty)); destinationEditor.append(row); });
    function message(text, error = false) { status.textContent = text; status.dataset.error = String(error); }
    function dirty() { message('Ada perubahan yang belum disimpan.'); }
    container.querySelector('.cms-save-settings').onclick = () => { const next = {}; container.querySelectorAll('[data-setting]').forEach(input => { next[input.dataset.setting] = input.value.trim(); }); try { HeroContent.saveSettings(next); message('Konten Hero tersimpan. Buka landing page untuk melihatnya.'); } catch (error) { message(error.message, true); } };
    container.querySelector('.cms-save-destinations').onclick = () => { const next = [...destinationEditor.children].map(row => ({ name: row.querySelector('[data-destination="name"]').value.trim(), flag: row.querySelector('[data-destination="flag"]').value.trim(), region: row.querySelector('[data-destination="name"]').value.trim(), modules: row.querySelector('[data-destination="modules"]').value.split(',').map(v => v.trim()).filter(Boolean), active: row.querySelector('[data-destination="active"]').checked })); try { HeroContent.saveDestinations(next); message('Negara dan modul tersimpan. Buka landing page untuk melihatnya.'); } catch (error) { message(error.message, true); } };
    function render() {
      list.replaceChildren();
      slides.forEach((slide, index) => {
        const card = document.createElement('article'); card.className = 'cms-card';
        const preview = document.createElement('img'); preview.className = 'cms-preview'; preview.alt = slide.alt; if (slide.src) preview.src = slide.src;
        const fields = document.createElement('div'); fields.className = 'cms-fields';
        const heading = document.createElement('strong'); heading.textContent = `Slide ${index + 1}`; fields.append(heading);
        function field(label, key, multiline = false) {
          const wrap = document.createElement('label'); wrap.textContent = label;
          const input = document.createElement(multiline ? 'textarea' : 'input'); input.value = slide[key]; input.maxLength = key === 'src' ? 2000 : 500;
          if (key === 'src' && slide.src.startsWith('data:')) { input.value = ''; input.placeholder = 'Gambar unggahan digunakan; isi URL untuk mengganti'; }
          input.addEventListener('input', () => { slide[key] = input.value.trim(); if (key === 'src' && HeroContent.validSource(slide.src)) preview.src = slide.src; if (key === 'alt') preview.alt = slide.alt; dirty(); });
          wrap.append(input); fields.append(wrap); return input;
        }
        const source = field('URL gambar (HTTPS) atau path assets/', 'src');
        const uploadLabel = document.createElement('label'); uploadLabel.textContent = 'Unggah gambar';
        const upload = document.createElement('input'); upload.type = 'file'; upload.accept = 'image/jpeg,image/png,image/webp';
        upload.addEventListener('change', async () => {
          const file = upload.files[0]; if (!file) return;
          if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 1024 * 1024) { message('Pilih JPG, PNG, atau WebP maksimal 1 MB.', true); upload.value = ''; return; }
          pending++;
          try {
            const data = await new Promise((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(reader.result); reader.onerror = reject; reader.readAsDataURL(file); });
            await new Promise((resolve, reject) => { const image = new Image(); image.onload = resolve; image.onerror = reject; image.src = data; });
            slide.src = data; preview.src = data; source.value = ''; source.placeholder = `Unggahan: ${file.name}`; dirty();
          } catch (_) { message('Gambar tidak dapat dibaca. Pilih file gambar yang valid.', true); }
          finally { pending--; }
        });
        uploadLabel.append(upload); fields.append(uploadLabel);
        field('Teks alternatif gambar (wajib)', 'alt'); field('Judul (opsional)', 'title'); field('Caption (opsional)', 'caption', true);
        const activeLabel = document.createElement('label'); activeLabel.className = 'cms-active';
        const active = document.createElement('input'); active.type = 'checkbox'; active.checked = slide.active; active.onchange = () => { slide.active = active.checked; dirty(); };
        activeLabel.append(active, 'Tampilkan slide'); fields.append(activeLabel);
        const actions = document.createElement('div'); actions.className = 'cms-actions';
        function action(text, disabled, handler) { const b = document.createElement('button'); b.type = 'button'; b.textContent = text; b.disabled = disabled; b.onclick = handler; actions.append(b); }
        action('↑ Naik', index === 0, () => { [slides[index - 1], slides[index]] = [slides[index], slides[index - 1]]; render(); dirty(); });
        action('↓ Turun', index === slides.length - 1, () => { [slides[index + 1], slides[index]] = [slides[index], slides[index + 1]]; render(); dirty(); });
        action('Hapus', slides.length === 1, () => { slides.splice(index, 1); render(); dirty(); });
        fields.append(actions); card.append(preview, fields); list.append(card);
      });
    }
    container.querySelector('.cms-add').onclick = () => {
      if (slides.length >= 10) { message('Maksimal 10 slide.', true); return; }
      slides.push({ src: '', alt: '', title: '', caption: '', active: true }); render(); dirty(); list.lastElementChild.querySelector('input').focus();
    };
    container.querySelector('.cms-save').onclick = () => {
      if (pending) { message('Tunggu hingga gambar selesai dibaca.', true); return; }
      try { HeroContent.save(slides); message('Perubahan tersimpan. Slider halaman utama sudah diperbarui di browser ini.'); }
      catch (error) { message(error.message, true); }
    };
    render();
  } };
})();
