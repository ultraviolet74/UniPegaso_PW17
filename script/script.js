document.addEventListener('DOMContentLoaded', () => {
  const esgDocuments = [
    {
      id: 'piano-26-27',
      category: 'piano',
      badge: 'Piano Strategico',
      year: '2026/2027',
      title: 'Piano di Sostenibilità 2026/2027',
      subtitle: 'Obiettivi pluriennali, target climatici e roadmap operativa di Gruppo.',
      url: 'pdf/Piano-Sostenibilita-26-27_ITA.pdf',
      featured: true
    },
    {
      id: 'piano-24-25',
      category: 'piano',
      badge: 'Piano Strategico',
      year: '2024/2025',
      title: 'Piano di Sostenibilità 2024/2025',
      subtitle: 'Primo Piano di Sostenibilità strutturato su direttrici ESG e Agenda 2030.',
      url: 'pdf/Piano-Sostenibilita-ITA-1.pdf',
      featured: false
    },
    {
      id: 'bilancio-2025',
      category: 'bilancio',
      badge: 'Bilancio ESG',
      year: '2025',
      title: 'Bilancio di Sostenibilità 2025',
      subtitle: 'Rendicontazione consolidata delle performance ambientali, sociali e di governance.',
      url: 'pdf/Minerali-Industriali-group_Bilancio-Sostenibilita-2025_ITA.pdf',
      featured: true
    },
    {
      id: 'bilancio-2024',
      category: 'bilancio',
      badge: 'Bilancio ESG',
      year: '2024',
      title: 'Bilancio di Sostenibilità 2024',
      subtitle: '4° Bilancio di Sostenibilità di Gruppo, certificato e integrato nella documentazione finanziaria.',
      url: 'pdf/Minerali-Industriali_Bilancio-Sostenibilita-2024.pdf',
      featured: false
    },
    {
      id: 'bilancio-2023',
      category: 'bilancio',
      badge: 'Bilancio ESG',
      year: '2023',
      title: 'Bilancio di Sostenibilità 2023',
      subtitle: '3° Bilancio di Sostenibilità di Gruppo certificato Deloitte.',
      url: 'pdf/Bilancio-Sostenibilita-2023_Gruppo-Minerali-Industriali_compressed-1.pdf',
      featured: false
    },
    {
      id: 'bilancio-2022',
      category: 'bilancio',
      badge: 'Bilancio ESG',
      year: '2022',
      title: 'Bilancio di Sostenibilità 2022',
      subtitle: '2° Bilancio di Sostenibilità esteso a livello di Gruppo.',
      url: 'pdf/Bilancio-di-Sostenibilita_MIGroup2022-1-1.pdf',
      featured: false
    },
    {
      id: 'bilancio-2021',
      category: 'bilancio',
      badge: 'Bilancio ESG',
      year: '2021',
      title: 'Bilancio di Sostenibilità 2021',
      subtitle: '1° Bilancio di Sostenibilità della capogruppo Minerali Industriali.',
      url: 'pdf/Report-Sostenibilita-2021-Minerali-Industriali-1.pdf',
      featured: false
    },
    {
      id: 'bilancio-2020',
      category: 'bilancio',
      badge: 'Bilancio ESG',
      year: '2020',
      title: 'Bilancio di Sostenibilità 2020',
      subtitle: 'Avvio della mappatura degli impatti sugli SDGs e prima rendicontazione.',
      url: 'pdf/Bilancio-sostenibilita-Minerali-Industriali-2020-1.pdf',
      featured: false
    }
  ];

  const documentsGrid = document.getElementById('documents-grid');
  const docCounter = document.getElementById('doc-counter');
  const searchInput = document.getElementById('doc-search-input');
  const noDocsMessage = document.getElementById('no-docs-message');
  const resetDocsBtn = document.getElementById('reset-docs-btn');
  const filterButtons = document.querySelectorAll('.doc-filter-btn');

  let currentDocCategory = 'all';
  let currentSearchTerm = '';
  let toastTimeout;

  function showToast(message) {
    const toast = document.getElementById('toast-notification');
    const toastMsg = document.getElementById('toast-message');
    if (!toast || !toastMsg) return;
    toastMsg.textContent = message;
    toast.classList.remove('translate-y-24', 'opacity-0', 'pointer-events-none');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.classList.add('translate-y-24', 'opacity-0', 'pointer-events-none');
    }, 3200);
  }

  function createRipple(event, button) {
    const circle = document.createElement('span');
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;
    const rect = button.getBoundingClientRect();

    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${event.clientX - rect.left - radius}px`;
    circle.style.top = `${event.clientY - rect.top - radius}px`;
    circle.classList.add('ripple-span');

    const existingRipple = button.querySelector('.ripple-span');
    if (existingRipple) existingRipple.remove();
    button.appendChild(circle);
  }

  function copyDocumentLink(url, title) {
    const fullUrl = new URL(url, window.location.href).href;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(fullUrl)
        .then(() => showToast(`Link copiato: ${title}`))
        .catch(() => fallbackCopy(fullUrl, title));
    } else {
      fallbackCopy(fullUrl, title);
    }
  }

  function fallbackCopy(text, title) {
    const tempInput = document.createElement('input');
    tempInput.value = text;
    document.body.appendChild(tempInput);
    tempInput.select();
    try {
      document.execCommand('copy');
      showToast(`Link copiato: ${title}`);
    } catch (err) {
      showToast('Impossibile copiare il link');
    }
    document.body.removeChild(tempInput);
  }

  function renderDocuments() {
    if (!documentsGrid) return;

    const filtered = esgDocuments.filter((doc) => {
      const matchesCat = currentDocCategory === 'all' || doc.category === currentDocCategory;
      const query = currentSearchTerm.trim().toLowerCase();
      const matchesQuery =
        !query ||
        doc.title.toLowerCase().includes(query) ||
        doc.year.toLowerCase().includes(query) ||
        doc.subtitle.toLowerCase().includes(query);
      return matchesCat && matchesQuery;
    });

    if (docCounter) {
      docCounter.textContent = `${filtered.length} ${filtered.length === 1 ? 'Pubblicazione' : 'Pubblicazioni'}`;
    }

    if (filtered.length === 0) {
      documentsGrid.innerHTML = '';
      if (noDocsMessage) noDocsMessage.classList.remove('hidden');
      return;
    }

    if (noDocsMessage) noDocsMessage.classList.add('hidden');
    documentsGrid.innerHTML = filtered
      .map((doc) => {
        const isPiano = doc.category === 'piano';
        const badgeClasses = isPiano
          ? 'bg-amber-400/20 text-amber-200 border-amber-300/30'
          : 'bg-brand-mint/20 text-brand-mint border-brand-mint/30';

        return `
          <article class="group bg-white/10 hover:bg-white/[0.14] backdrop-blur-xl border ${doc.featured ? 'border-brand-mint/50' : 'border-white/20'} rounded-3xl p-6 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 shadow-lg">
            <div>
              <div class="flex items-center justify-between gap-2 mb-4">
                <span class="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border ${badgeClasses}">
                  ${doc.badge}
                </span>
                <span class="text-xs font-bold text-white/60 uppercase tracking-wider">PDF</span>
              </div>
              <div class="font-display text-3xl font-extrabold text-white tracking-tight mb-2 group-hover:text-brand-mint transition-colors">
                ${doc.year}
              </div>
              <h3 class="font-display text-lg font-bold text-white leading-snug mb-2">
                ${doc.title}
              </h3>
              <p class="text-emerald-100/75 text-xs sm:text-sm leading-relaxed mb-6">
                ${doc.subtitle}
              </p>
            </div>
            <div class="pt-4 border-t border-white/15 flex items-center gap-2">
              <a
                href="${doc.url}"
                target="_blank"
                rel="noopener"
                data-doc-title="${doc.title}"
                class="btn-download-esg flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-brand-lime hover:bg-[#529627] text-white font-display font-bold text-xs sm:text-sm shadow-md"
              >
                <span class="btn-label">Scarica PDF</span>
              </a>
              <button
                type="button"
                data-copy-url="${doc.url}"
                data-copy-title="${doc.title}"
                title="Copia link diretto al PDF"
                aria-label="Copia link diretto per ${doc.title}"
                class="copy-doc-btn p-3 rounded-xl bg-white/10 hover:bg-white/25 text-white border border-white/15 transition-colors shrink-0"
              >
                Copia
              </button>
            </div>
          </article>
        `;
      })
      .join('');

    documentsGrid.querySelectorAll('.btn-download-esg').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        createRipple(e, btn);
        const label = btn.querySelector('.btn-label');
        const docTitle = btn.getAttribute('data-doc-title');
        if (label) label.textContent = 'Apertura PDF...';
        showToast(`Apertura documento: ${docTitle}`);
        setTimeout(() => {
          if (label) label.textContent = 'Scarica PDF';
        }, 2000);
      });
    });

    documentsGrid.querySelectorAll('.copy-doc-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        copyDocumentLink(btn.getAttribute('data-copy-url'), btn.getAttribute('data-copy-title'));
      });
    });
  }

  filterButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterButtons.forEach((b) => {
        b.classList.remove('active', 'bg-brand-lime', 'shadow-md');
        b.classList.add('bg-white/10');
      });
      btn.classList.add('active', 'bg-brand-lime', 'shadow-md');
      btn.classList.remove('bg-white/10');
      currentDocCategory = btn.getAttribute('data-doc-filter') || 'all';
      renderDocuments();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      currentSearchTerm = e.target.value;
      renderDocuments();
    });
  }

  if (resetDocsBtn) {
    resetDocsBtn.addEventListener('click', () => {
      currentDocCategory = 'all';
      currentSearchTerm = '';
      if (searchInput) searchInput.value = '';
      filterButtons.forEach((b, idx) => {
        if (idx === 0) {
          b.classList.add('active', 'bg-brand-lime', 'shadow-md');
          b.classList.remove('bg-white/10');
        } else {
          b.classList.remove('active', 'bg-brand-lime', 'shadow-md');
          b.classList.add('bg-white/10');
        }
      });
      renderDocuments();
    });
  }

  renderDocuments();

  // Filtro SDG
  const sdgFilterBtns = document.querySelectorAll('.sdg-filter-btn');
  const sdgCards = document.querySelectorAll('.sdg-card');
  sdgFilterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      sdgFilterBtns.forEach((b) => {
        b.classList.remove('active', 'bg-brand-primary', 'text-white');
        b.classList.add('bg-slate-100', 'text-slate-700');
      });
      btn.classList.add('active', 'bg-brand-primary', 'text-white');
      btn.classList.remove('bg-slate-100', 'text-slate-700');

      const cat = btn.getAttribute('data-sdg-filter');
      sdgCards.forEach((card) => {
        card.classList.toggle('hidden', cat !== 'all' && card.getAttribute('data-sdg-cat') !== cat);
      });
    });
  });

  // Filtro Riconoscimenti
  const awardTabBtns = document.querySelectorAll('.award-tab-btn');
  const awardBlocks = document.querySelectorAll('.award-year-block');
  awardTabBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      awardTabBtns.forEach((b) => {
        b.classList.remove('active', 'bg-brand-primary', 'text-white', 'shadow-sm');
        b.classList.add('bg-slate-100', 'text-slate-700');
      });
      btn.classList.add('active', 'bg-brand-primary', 'text-white', 'shadow-sm');
      btn.classList.remove('bg-slate-100', 'text-slate-700');

      const year = btn.getAttribute('data-award-year');
      awardBlocks.forEach((block) => {
        block.classList.toggle('hidden', year !== 'all' && block.getAttribute('data-award-block') !== year);
      });
    });
  });

  // Header scroll e menu mobile
  const header = document.getElementById('site-header');
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const iconOpen = document.getElementById('menu-icon-open');
  const iconClose = document.getElementById('menu-icon-close');

  window.addEventListener(
    'scroll',
    () => {
      if (!header) return;
      header.classList.toggle('scrolled', window.scrollY > 24);
    },
    { passive: true }
  );

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      const isHidden = mobileMenu.classList.toggle('hidden');
      mobileMenuBtn.setAttribute('aria-expanded', String(!isHidden));
      if (iconOpen) iconOpen.classList.toggle('hidden', !isHidden);
      if (iconClose) iconClose.classList.toggle('hidden', isHidden);
    });
  }

  document.querySelectorAll('.mobile-nav-link').forEach((link) => {
    link.addEventListener('click', () => {
      if (mobileMenu) mobileMenu.classList.add('hidden');
      if (mobileMenuBtn) mobileMenuBtn.setAttribute('aria-expanded', 'false');
      if (iconOpen) iconOpen.classList.remove('hidden');
      if (iconClose) iconClose.classList.add('hidden');
    });
  });

  // Animazioni allo scorrimento
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  document.querySelectorAll('.reveal-up').forEach((el) => observer.observe(el));
});