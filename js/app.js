(function () {
  "use strict";

  const STORAGE_KEY = "avora-demo-v1";
  const THEME_KEY = "avora-theme";
  const initialData = window.AvoraData;
  const app = document.getElementById("app");
  const toastRegion = document.getElementById("toast-region");
  const defaults = () => ({
    favorites: [],
    requests: [],
    interests: [],
    opportunities: initialData.opportunities.map((item) => ({ ...item })),
    profile: {
      name: "Lia Martins",
      city: "Mogi das Cruzes",
      bio: initialData.artists[0].bio,
      instruments: "Voz, Violão",
      styles: "MPB, Pop acústico, Samba",
      price: 650,
      available: true,
      days: ["Sexta", "Sábado"]
    }
  });
  let saved = loadSaved();
  const state = {
    theme: loadTheme(),
    role: "contratante",
    page: "welcome",
    signup: false,
    search: "",
    city: "",
    style: "",
    fee: "",
    availability: "",
    artistId: initialData.artists[0].id,
    modal: null
  };

  function loadSaved() {
    try {
      const value = JSON.parse(localStorage.getItem(STORAGE_KEY));
      return value && typeof value === "object" ? { ...defaults(), ...value } : defaults();
    } catch (error) {
      return defaults();
    }
  }

  function loadTheme() {
    try {
      return localStorage.getItem(THEME_KEY) === "light" ? "light" : "dark";
    } catch (error) {
      return "dark";
    }
  }

  function persist() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
    } catch (error) {
      showToast("Não foi possível salvar neste navegador.");
    }
  }

  function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, (character) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    })[character]);
  }

  function money(value) {
    return Number(value || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
  }

  function dateBR(value) {
    if (!value) return "A combinar";
    return new Date(`${value}T12:00:00`).toLocaleDateString("pt-BR");
  }

  function showToast(message) {
    toastRegion.innerHTML = `<div class="toast">${escapeHTML(message)}</div>`;
    window.setTimeout(() => { toastRegion.innerHTML = ""; }, 3400);
  }

  function avatar(person, size = "") {
    return `<span class="avatar ${size} avatar-${escapeHTML(person.color || "lilac")}" aria-hidden="true">${escapeHTML(person.initials || person.name.split(" ").map((part) => part[0]).slice(0, 2).join(""))}</span>`;
  }

  function logo() {
    return `<a class="brand" href="#inicio" data-action="go" data-page="explore" aria-label="Avora, página inicial"><img class="brand-image" src="assets/logo-${state.theme}.png" alt="Avora"></a>`;
  }

  function themeToggle() {
    const isLight = state.theme === "light";
    const nextTheme = isLight ? "escuro" : "claro";
    return `<button class="theme-toggle" data-action="toggle-theme" type="button" aria-label="Ativar modo ${nextTheme}" aria-pressed="${isLight}" title="Ativar modo ${nextTheme}"><span aria-hidden="true">${isLight ? "☾" : "☼"}</span></button>`;
  }

  function header() {
    return `<header class="topbar"><div class="topbar-inner">${logo()}<nav class="main-nav" aria-label="Navegação principal">
      ${state.role === "contratante" ? `<button class="nav-link ${state.page === "explore" || state.page === "profile" ? "is-active" : ""}" data-action="go" data-page="explore">Descobrir</button>` : `<button class="nav-link ${state.page === "musician" ? "is-active" : ""}" data-action="go" data-page="musician">Meu espaço</button>`}
      <button class="nav-link ${state.page === "opportunities" ? "is-active" : ""}" data-action="go" data-page="opportunities">Oportunidades</button>
      <button class="nav-link" data-action="show-favorites">Salvos <span class="nav-count">${saved.favorites.length}</span></button>
    </nav><div class="top-actions">${themeToggle()}<span class="demo-tag"><span></span> Modo demonstração</span><button class="role-switch" data-action="switch-role" aria-label="Alternar perfil">${state.role === "contratante" ? "Contratante" : "Músico"}<span aria-hidden="true">↗</span></button></div></div></header>`;
  }

  function shell(content) {
    app.innerHTML = `${header()}<div class="page-wrap">${content}<footer class="site-footer"><span>avora. <span>Talentos próximos. Encontros que viram música.</span></span><button class="text-button" data-action="reset">Restaurar dados iniciais</button></footer></div>${state.modal ? modalMarkup() : ""}`;
    if (state.modal) {
      const firstField = app.querySelector(".modal input, .modal select, .modal textarea, .modal button");
      if (firstField) firstField.focus();
    }
  }

  function welcomePage() {
    app.innerHTML = `<section class="welcome-screen"><div class="welcome-art" aria-hidden="true"><div class="sound-lines"></div><span class="art-note note-one">♪</span><span class="art-note note-two">♫</span><span class="art-orbit orbit-one"></span><span class="art-orbit orbit-two"></span><div class="art-caption">A cidade tem<br><em>uma trilha sonora.</em></div><div class="art-stamp">SOM LOCAL<br>EM MOVIMENTO</div></div><div class="welcome-panel"><div class="welcome-top">${logo()}<div class="welcome-top-actions">${themeToggle()}<span class="demo-tag"><span></span> Demonstração</span></div></div><div class="welcome-copy"><p class="eyebrow">MÚSICA A UM ENCONTRO DE DISTÂNCIA</p><h1>Talentos próximos.<br><em>Encontros que viram música.</em></h1><p class="welcome-description">O palco certo, a parceria que faltava, a música que aproxima. Tudo começa por aqui.</p></div><div class="role-label">Como você quer chegar?</div><div class="role-choices" role="group" aria-label="Escolha seu perfil">
      <button class="role-card ${state.role === "contratante" ? "selected" : ""}" data-action="choose-role" data-role="contratante"><span class="role-icon" aria-hidden="true">⌂</span><span><strong>Sou contratante</strong><small>Quero encontrar e contratar artistas</small></span><span class="role-radio" aria-hidden="true"></span></button>
      <button class="role-card ${state.role === "musico" ? "selected" : ""}" data-action="choose-role" data-role="musico"><span class="role-icon" aria-hidden="true">♫</span><span><strong>Sou músico ou banda</strong><small>Quero divulgar meu trabalho e encontrar oportunidades</small></span><span class="role-radio" aria-hidden="true"></span></button>
    </div><form class="access-form" data-form="access"><label for="access-email">E-mail</label><input id="access-email" name="email" type="email" placeholder="voce@exemplo.com" required autocomplete="email"><label for="access-password">Senha</label><input id="access-password" name="password" type="password" placeholder="Mínimo de 6 caracteres" minlength="6" required autocomplete="current-password">${state.signup ? signupFields() : ""}<button class="button button-primary button-wide" type="submit">${state.signup ? "Criar conta de demonstração" : "Entrar"}<span aria-hidden="true">→</span></button></form><div class="access-divider"><span>ou entre sem credenciais</span></div><button class="button button-quiet button-wide" data-action="explore-demo">Explorar demonstração <span aria-hidden="true">↗</span></button><p class="signup-prompt">${state.signup ? "Já tem cadastro?" : "Novo por aqui?"} <button class="text-button" data-action="toggle-signup">${state.signup ? "Entrar" : "Criar conta"}</button></p><p class="privacy-note">Demonstração local. Nenhuma senha é armazenada ou enviada.</p></div></section>`;
  }

  function signupFields() {
    if (state.role === "contratante") return `<label for="signup-name">Nome ou estabelecimento</label><input id="signup-name" name="name" required><label for="signup-city">Cidade</label>${citySelect("signup-city", "Mogi das Cruzes", true)}<label for="signup-event">Tipo de evento que costuma realizar</label><input id="signup-event" name="eventType" placeholder="Ex.: noites ao vivo" required>`;
    return `<label for="signup-name">Nome artístico</label><input id="signup-name" name="name" required><label for="signup-city">Cidade</label>${citySelect("signup-city", "Mogi das Cruzes", true)}<label for="signup-instruments">Instrumentos</label><input id="signup-instruments" name="instruments" placeholder="Ex.: voz, violão" required><label for="signup-styles">Estilos musicais</label><input id="signup-styles" name="styles" placeholder="Ex.: MPB, samba" required>`;
  }

  function citySelect(id, selected = "", required = false) {
    return `<select id="${id}" name="city" ${required ? "required" : ""}><option value="">Selecione uma cidade</option>${initialData.cities.map((city) => `<option ${city === selected ? "selected" : ""}>${escapeHTML(city)}</option>`).join("")}</select>`;
  }

  function artistCard(person) {
    const favorite = saved.favorites.includes(person.id);
    return `<article class="artist-card"> <div class="artist-card-top"><button class="avatar-button" data-action="profile" data-id="${person.id}" aria-label="Ver perfil de ${escapeHTML(person.name)}">${avatar(person, "avatar-large")}</button><button class="icon-button favorite-button ${favorite ? "favorited" : ""}" data-action="favorite" data-id="${person.id}" aria-label="${favorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}" title="${favorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}">${favorite ? "♥" : "♡"}</button><span class="artist-index">AV / ${String(initialData.artists.indexOf(person) + 1).padStart(2, "0")}</span></div><div class="artist-card-body"><div class="artist-heading"><h3>${escapeHTML(person.name)}</h3><span class="rating"><span aria-hidden="true">★</span> ${person.rating.toFixed(1).replace(".", ",")}</span></div><p class="artist-meta">${escapeHTML(person.city)} <span>·</span> ${person.formats.map(escapeHTML).join(" / ")}</p><div class="tag-row">${person.styles.slice(0, 2).map((style) => `<span class="tag">${escapeHTML(style)}</span>`).join("")}</div><div class="artist-card-foot"><span>Desde <strong>${money(person.price)}</strong></span><span class="availability ${person.available ? "available" : "busy"}"><i></i>${person.available ? "Disponível" : "Agenda cheia"}</span></div><div class="card-actions"><button class="button button-outline" data-action="profile" data-id="${person.id}">Ver perfil</button><button class="button button-primary" data-action="request" data-id="${person.id}">Pedir orçamento <span aria-hidden="true">↗</span></button></div></div></article>`;
  }

  function filteredArtists() {
    const query = state.search.trim().toLocaleLowerCase("pt-BR");
    return initialData.artists.filter((person) => {
      const searchable = [person.name, person.city, ...person.styles, ...person.instruments].join(" ").toLocaleLowerCase("pt-BR");
      const matchesFee = !state.fee || (state.fee === "ate-800" ? person.price <= 800 : state.fee === "800-1500" ? person.price > 800 && person.price <= 1500 : person.price > 1500);
      return (!query || searchable.includes(query)) && (!state.city || person.areas.includes(state.city)) && (!state.style || person.styles.includes(state.style)) && matchesFee && (state.availability !== "sim" || person.available);
    });
  }

  function explorePage() {
    const styles = [...new Set(initialData.artists.flatMap((person) => person.styles))].sort((a, b) => a.localeCompare(b, "pt-BR"));
    const artists = filteredArtists();
    shell(`<section class="page-heading explore-heading"><div><p class="eyebrow">A CENA COMEÇA PERTO</p><h1>Encontre seu <em>próximo som.</em></h1><p>Artistas independentes, histórias únicas e música feita para o seu momento.</p></div><div class="heading-mark" aria-hidden="true">♪</div></section><form class="search-panel" data-form="filters"><label class="search-field"><span aria-hidden="true">⌕</span><span class="sr-only">Buscar por nome, instrumento ou estilo</span><input name="search" value="${escapeHTML(state.search)}" placeholder="Nome, instrumento ou estilo musical"></label><label class="filter-field"><span>Cidade ou região</span><select name="city"><option value="">Todas as cidades</option>${initialData.cities.map((city) => `<option ${city === state.city ? "selected" : ""}>${escapeHTML(city)}</option>`).join("")}</select></label><label class="filter-field"><span>Estilo</span><select name="style"><option value="">Todos os estilos</option>${styles.map((style) => `<option ${style === state.style ? "selected" : ""}>${escapeHTML(style)}</option>`).join("")}</select></label><label class="filter-field"><span>Cachê inicial</span><select name="fee"><option value="">Qualquer valor</option><option value="ate-800" ${state.fee === "ate-800" ? "selected" : ""}>Até R$ 800</option><option value="800-1500" ${state.fee === "800-1500" ? "selected" : ""}>R$ 800 a R$ 1.500</option><option value="acima-1500" ${state.fee === "acima-1500" ? "selected" : ""}>Acima de R$ 1.500</option></select></label><label class="filter-field"><span>Disponibilidade</span><select name="availability"><option value="">Qualquer agenda</option><option value="sim" ${state.availability === "sim" ? "selected" : ""}>Disponíveis</option></select></label><button class="button button-primary filter-submit" type="submit">Aplicar filtros</button></form><section class="results-section"><div class="section-heading"><div><p class="eyebrow">CURADORIA AVORA <span class="result-count">${artists.length} talentos</span></p><h2>Quem toca por aqui</h2></div><button class="text-button" data-action="clear-filters">Limpar filtros <span aria-hidden="true">↺</span></button></div>${artists.length ? `<div class="artist-grid">${artists.map(artistCard).join("")}</div>` : `<div class="empty-state"><span aria-hidden="true">∅</span><h3>Nenhum músico encontrado com esses filtros</h3><p>Tente ampliar a busca ou escolher outra cidade.</p><button class="button button-outline" data-action="clear-filters">Limpar filtros</button></div>`}</section><section class="nearby-strip"><div><span class="eyebrow">DA SUA CIDADE PARA O MUNDO</span><h2>Tem espaço para todo ritmo.</h2><p>Explore oportunidades, encontre parceiros e faça parte da cena local.</p></div><button class="button button-light" data-action="go" data-page="opportunities">Ver mural de oportunidades <span aria-hidden="true">↗</span></button></section>`);
  }

  function profilePage() {
    const person = initialData.artists.find((item) => item.id === state.artistId) || initialData.artists[0];
    shell(`<button class="back-link" data-action="go" data-page="explore">← Voltar para descoberta</button><section class="profile-hero"><div class="profile-avatar-wrap">${avatar(person, "avatar-hero")}<span class="profile-spark" aria-hidden="true">✳</span></div><div class="profile-intro"><p class="eyebrow">ARTISTA AVORA <span class="verified">● PERFIL DE DEMONSTRAÇÃO</span></p><h1>${escapeHTML(person.name)}</h1><p class="profile-location">⌖ ${escapeHTML(person.city)} <span>·</span> atende ${person.areas.map(escapeHTML).join(", ")}</p><p class="profile-bio">${escapeHTML(person.bio)}</p><div class="tag-row">${person.styles.map((style) => `<span class="tag">${escapeHTML(style)}</span>`).join("")}</div><div class="profile-quick"><span class="rating"><span aria-hidden="true">★</span> ${person.rating.toFixed(1).replace(".", ",")} <small>(${person.reviews} avaliações fictícias)</small></span><span class="availability ${person.available ? "available" : "busy"}"><i></i>${person.available ? "Disponível para novas datas" : "Agenda cheia no momento"}</span></div></div><aside class="price-panel"><span class="eyebrow">CACHÊ INICIAL</span><strong>${money(person.price)}</strong><span>por ${escapeHTML(person.duration)} de apresentação</span><button class="button button-primary button-wide" data-action="request" data-id="${person.id}">Solicitar orçamento <span aria-hidden="true">↗</span></button><button class="button button-outline button-wide" data-action="favorite" data-id="${person.id}">${saved.favorites.includes(person.id) ? "♥ Salvo nos favoritos" : "♡ Salvar artista"}</button></aside></section><div class="profile-columns"><section class="content-panel"><div class="section-heading"><div><p class="eyebrow">UM POUCO DO SOM</p><h2>Formação & repertório</h2></div></div><div class="detail-list"><div><span>Instrumentos</span><strong>${person.instruments.map(escapeHTML).join(" · ")}</strong></div><div><span>Formato</span><strong>${person.formats.map(escapeHTML).join(" · ")}</strong></div><div><span>Duração média</span><strong>${escapeHTML(person.duration)}</strong></div><div><span>Regiões atendidas</span><strong>${person.areas.map(escapeHTML).join(" · ")}</strong></div></div><div class="portfolio-block"><p class="eyebrow">PORTFÓLIO</p><h3>O palco é seu</h3><div class="media-empty"><span aria-hidden="true">♫</span><div><strong>Em breve, mais música por aqui</strong><p>Este perfil de demonstração ainda não tem fotos, áudios ou vídeos enviados.</p></div></div></div></section><aside class="content-panel review-panel"><p class="eyebrow">QUEM JÁ OUVIU</p><h2>Palavras que ficam</h2><p class="demo-disclaimer">Avaliações fictícias para demonstração</p>${person.reviewsText.map((review) => `<blockquote><span class="rating" aria-label="5 de 5 estrelas">★★★★★</span><p>“${escapeHTML(review)}”</p><cite>Contratante verificado · apresentação local</cite></blockquote>`).join("")}<div class="availability-card"><span aria-hidden="true">◷</span><div><strong>Agenda da semana</strong><p>${saved.profile.days.join(" · ") || "Consulte disponibilidade"}</p></div><i class="availability-dot"></i></div></aside></div>`);
  }

  function opportunityCard(item) {
    const hiring = item.type === "contratacao";
    const interested = saved.interests.includes(item.id);
    return `<article class="opportunity-card"><div class="opportunity-top"><span class="opportunity-type ${hiring ? "type-hiring" : "type-band"}">${hiring ? "◉ Contratação" : "♫ Parceria musical"}</span><button class="icon-button favorite-button ${saved.favorites.includes(item.id) ? "favorited" : ""}" data-action="favorite" data-id="${item.id}" aria-label="${saved.favorites.includes(item.id) ? "Remover dos salvos" : "Salvar oportunidade"}">${saved.favorites.includes(item.id) ? "♥" : "♡"}</button></div><h3>${escapeHTML(item.title)}</h3><p class="opportunity-description">${escapeHTML(item.description)}</p><div class="opportunity-tags"><span>⌖ ${escapeHTML(item.city)}</span><span>♫ ${escapeHTML(item.style)}</span>${item.date ? `<span>◷ ${dateBR(item.date)}</span>` : ""}${item.budget ? `<span class="budget-tag">Até ${money(item.budget)}</span>` : ""}</div><div class="opportunity-foot"><span>Publicado por <strong>${escapeHTML(item.author)}</strong></span><button class="text-button" data-action="opportunity-interest" data-id="${item.id}" ${interested ? "disabled" : ""}>${interested ? "Interesse registrado" : hiring ? "Tenho interesse" : "Quero conversar"} <span aria-hidden="true">${interested ? "✓" : "↗"}</span></button></div></article>`;
  }

  function opportunitiesPage() {
    const items = saved.opportunities;
    shell(`<section class="page-heading"><div><p class="eyebrow">A CENA SE MOVE</p><h1>Oportunidades <em>em aberto.</em></h1><p>Shows, parcerias e novos começos na sua região.</p></div><button class="button button-primary" data-action="new-opportunity">+ Publicar oportunidade</button></section><div class="opportunity-intro"><span class="pulse-dot"></span> Atualizado pela comunidade Avora <span class="intro-divider">/</span> ${items.length} anúncios ativos</div><section class="opportunity-grid">${items.length ? items.map(opportunityCard).join("") : `<div class="empty-state"><h3>O mural está quieto por enquanto</h3><p>Publique a primeira oportunidade e dê o próximo acorde.</p><button class="button button-primary" data-action="new-opportunity">Publicar oportunidade</button></div>`}</section>`);
  }

  function requestCard(item) {
    const statusName = { pendente: "Pendente", aceita: "Aceita", recusada: "Recusada" }[item.status] || "Pendente";
    return `<article class="request-card"><div class="request-card-head"><div><span class="eyebrow">${escapeHTML(item.eventType)} · ${dateBR(item.date)} às ${escapeHTML(item.time)}</span><h3>${escapeHTML(item.artistName)}</h3></div><span class="status-pill status-${item.status}"><i></i>${statusName}</span></div><div class="request-details"><span>⌖ ${escapeHTML(item.city)} · ${escapeHTML(item.venue)}</span><span>◷ ${escapeHTML(item.duration)}</span><span>Orçamento: ${money(item.budget)}</span></div><p class="request-message">“${escapeHTML(item.message || "Sem mensagem adicional.")}"</p>${item.status === "pendente" ? `<div class="request-actions"><button class="button button-outline" data-action="request-status" data-id="${item.id}" data-status="recusada">Recusar</button><button class="button button-primary" data-action="request-status" data-id="${item.id}" data-status="aceita">Aceitar solicitação</button></div>` : `<p class="request-updated">Solicitação ${item.status === "aceita" ? "aceita" : "recusada"} nesta demonstração.</p>`}</article>`;
  }

  function musicianPage() {
    const profile = saved.profile;
    const requests = saved.requests;
    const pending = requests.filter((item) => item.status === "pendente").length;
    const upcoming = saved.opportunities.filter((item) => item.type === "contratacao" && item.city === profile.city).slice(0, 2);
    shell(`<section class="page-heading dashboard-heading"><div><p class="eyebrow">SEU ESPAÇO AVORA</p><h1>Bom te ver, <em>${escapeHTML(profile.name.split(" ")[0])}.</em></h1><p>Seu próximo encontro musical pode começar hoje.</p></div><button class="button button-outline" data-action="edit-profile">✎ Editar perfil</button></section><section class="dashboard-stats"><article><span class="stat-icon stat-violet">♫</span><span class="eyebrow">PERFIL</span><strong>${escapeHTML(profile.city)}</strong><small>${escapeHTML(profile.styles)}</small></article><article><span class="stat-icon stat-amber">◷</span><span class="eyebrow">AGENDA</span><strong>${profile.available ? "Disponível" : "Indisponível"}</strong><small>${profile.days.map(escapeHTML).join(" · ") || "Selecione seus dias"}</small></article><article><span class="stat-icon stat-mint">✉</span><span class="eyebrow">PEDIDOS</span><strong>${requests.length} <small>recebidos</small></strong><small>${pending} aguardando resposta</small></article></section><div class="dashboard-columns"><section class="dashboard-section"><div class="section-heading"><div><p class="eyebrow">INBOX DE CONTRATAÇÕES</p><h2>Solicitações recebidas <span class="heading-count">${pending}</span></h2></div></div>${requests.length ? `<div class="request-list">${requests.map(requestCard).join("")}</div>` : `<div class="empty-state compact-empty"><span aria-hidden="true">♫</span><h3>Sua caixa de entrada está em silêncio</h3><p>Quando alguém solicitar um orçamento, ele aparecerá aqui.</p></div>`}</section><aside class="dashboard-aside"><section class="content-panel availability-panel"><div class="section-heading"><div><p class="eyebrow">SEU RITMO</p><h2>Disponibilidade</h2></div></div><label class="toggle-row"><span><strong>Receber novos pedidos</strong><small>Mostra seu perfil para contratantes</small></span><input type="checkbox" data-action="availability-toggle" ${profile.available ? "checked" : ""}><span class="toggle-ui" aria-hidden="true"></span></label><p class="eyebrow day-label">DIAS PREFERIDOS</p><div class="day-pills">${["Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"].map((day) => `<label class="day-pill ${profile.days.includes(day) ? "day-selected" : ""}"><input type="checkbox" data-action="day-toggle" value="${day}" ${profile.days.includes(day) ? "checked" : ""}><span>${day.slice(0, 3)}</span></label>`).join("")}</div></section><section class="content-panel nearby-opportunities"><p class="eyebrow">PERTO DE VOCÊ</p><h2>Próximos acordes</h2>${upcoming.length ? upcoming.map((item) => `<div class="mini-opportunity"><span class="mini-date">${item.date ? dateBR(item.date).split("/")[0] : "♫"}</span><div><strong>${escapeHTML(item.title)}</strong><small>${escapeHTML(item.city)} · ${item.style}</small></div></div>`).join("") : `<p class="muted-copy">Nenhuma contratação anunciada em ${escapeHTML(profile.city)}.</p>`}<button class="text-button" data-action="go" data-page="opportunities">Ver todas as oportunidades →</button></section></aside></div>`);
  }

  function modalMarkup() {
    let title = "", body = "";
    if (state.modal.type === "request") {
      const person = initialData.artists.find((item) => item.id === state.modal.id) || initialData.artists[0];
      title = `Vamos fazer ${escapeHTML(person.name)} tocar?`;
      body = `<p class="modal-lede">Conte um pouco sobre seu evento. O pedido ficará visível na área do músico, sem envio de mensagens reais.</p><form data-form="request"><input type="hidden" name="artistId" value="${person.id}"><label for="event-type">Tipo de evento</label><select id="event-type" name="eventType" required><option value="">Selecione</option><option>Aniversário</option><option>Evento corporativo</option><option>Show em estabelecimento</option><option>Casamento</option><option>Outro</option></select><div class="form-row"><div><label for="event-date">Data</label><input id="event-date" name="date" type="date" required></div><div><label for="event-time">Horário</label><input id="event-time" name="time" type="time" required></div></div><label for="event-city">Cidade</label>${citySelect("event-city", "", true)}<label for="event-venue">Local ou endereço</label><input id="event-venue" name="venue" placeholder="Nome do espaço ou bairro" required><div class="form-row"><div><label for="event-duration">Duração desejada</label><select id="event-duration" name="duration" required><option value="">Selecione</option><option>1 hora</option><option>2 horas</option><option>3 horas</option><option>4 horas ou mais</option></select></div><div><label for="event-budget">Orçamento estimado (R$)</label><input id="event-budget" name="budget" type="number" min="1" placeholder="Ex.: 900" required></div></div><label for="event-message">Detalhes para o artista</label><textarea id="event-message" name="message" rows="3" placeholder="Repertório, estrutura do espaço, clima do evento…" required></textarea><div class="demo-notice">◉ Pedido simulado. Nenhum pagamento ou mensagem será enviado.</div><button class="button button-primary button-wide" type="submit">Enviar solicitação de demonstração <span aria-hidden="true">→</span></button></form>`;
    } else if (state.modal.type === "opportunity") {
      title = "Abra espaço para o próximo som.";
      body = `<p class="modal-lede">Publique um anúncio fictício no mural local. Os dados ficam só neste navegador.</p><form data-form="opportunity"><label for="opp-type">O que você procura?</label><select id="opp-type" name="type" required><option value="">Selecione</option><option value="contratacao">Contratar artista para apresentação</option><option value="parceria">Encontrar músico para banda ou ensaio</option></select><label for="opp-title">Título do anúncio</label><input id="opp-title" name="title" placeholder="Ex.: Bar procura voz e violão" required><label for="opp-city">Cidade</label>${citySelect("opp-city", "", true)}<div class="form-row"><div><label for="opp-date">Data (se aplicável)</label><input id="opp-date" name="date" type="date"></div><div><label for="opp-style">Estilo musical</label><input id="opp-style" name="style" placeholder="Ex.: MPB, rock" required></div></div><label for="opp-budget">Orçamento em reais (opcional)</label><input id="opp-budget" name="budget" type="number" min="0" placeholder="Não informar"><label for="opp-description">Descrição</label><textarea id="opp-description" name="description" rows="3" required></textarea><label for="opp-author">Publicado por</label><input id="opp-author" name="author" placeholder="Seu nome ou estabelecimento" required><button class="button button-primary button-wide" type="submit">Publicar no mural <span aria-hidden="true">→</span></button></form>`;
    } else if (state.modal.type === "edit-profile") {
      title = "Seu perfil, no seu tom.";
      body = `<form data-form="edit-profile"><label for="profile-name">Nome artístico</label><input id="profile-name" name="name" value="${escapeHTML(saved.profile.name)}" required><label for="profile-city">Cidade</label>${citySelect("profile-city", saved.profile.city, true)}<label for="profile-instruments">Instrumentos</label><input id="profile-instruments" name="instruments" value="${escapeHTML(saved.profile.instruments)}" required><label for="profile-styles">Estilos musicais</label><input id="profile-styles" name="styles" value="${escapeHTML(saved.profile.styles)}" required><label for="profile-price">Cachê inicial (R$)</label><input id="profile-price" name="price" type="number" min="1" value="${saved.profile.price}" required><label for="profile-bio">Apresentação</label><textarea id="profile-bio" name="bio" rows="3" required>${escapeHTML(saved.profile.bio)}</textarea><button class="button button-primary button-wide" type="submit">Salvar perfil</button></form>`;
    } else if (state.modal.type === "favorites") {
      const people = saved.favorites.map((id) => initialData.artists.find((item) => item.id === id)).filter(Boolean);
      const opps = saved.opportunities.filter((item) => saved.favorites.includes(item.id));
      title = "Sua seleção Avora";
      body = people.length || opps.length ? `<div class="saved-list">${people.map((person) => `<button class="saved-item" data-action="profile" data-id="${person.id}">${avatar(person)}<span><strong>${escapeHTML(person.name)}</strong><small>${escapeHTML(person.city)} · ${person.styles[0]}</small></span><span>→</span></button>`).join("")}${opps.map((item) => `<div class="saved-item">♫ <span><strong>${escapeHTML(item.title)}</strong><small>${escapeHTML(item.city)} · oportunidade</small></span></div>`).join("")}</div>` : `<div class="empty-state compact-empty"><h3>Nenhum favorito por enquanto</h3><p>Salve artistas ou oportunidades para encontrá-los depois.</p></div>`;
    } else {
      const opportunity = saved.opportunities.find((item) => item.id === state.modal.id);
      title = "Interesse registrado";
      body = `<p class="modal-lede">${opportunity ? `Seu interesse em “${escapeHTML(opportunity.title)}” foi salvo nesta demonstração.` : "Seu interesse foi salvo nesta demonstração."} Nenhuma mensagem real será enviada.</p><button class="button button-primary button-wide" data-action="close-modal">Entendi</button>`;
    }
    return `<div class="modal-backdrop" data-action="close-backdrop"><section class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title"><div class="modal-heading"><div><p class="eyebrow">AVORA · DEMONSTRAÇÃO</p><h2 id="modal-title">${title}</h2></div><button class="icon-button modal-close" data-action="close-modal" aria-label="Fechar">×</button></div>${body}</section></div>`;
  }

  function go(page) {
    state.page = page;
    state.modal = null;
    render();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function render() {
    document.documentElement.dataset.theme = state.theme;
    if (state.page === "welcome") return welcomePage();
    if (state.page === "explore") return explorePage();
    if (state.page === "profile") return profilePage();
    if (state.page === "opportunities") return opportunitiesPage();
    return musicianPage();
  }

  app.addEventListener("click", (event) => {
    const control = event.target.closest("[data-action]");
    if (!control) return;
    const action = control.dataset.action;
    if (action === "go") go(control.dataset.page);
    if (action === "choose-role") { state.role = control.dataset.role; render(); }
    if (action === "toggle-signup") { state.signup = !state.signup; render(); }
    if (action === "toggle-theme") {
      state.theme = state.theme === "dark" ? "light" : "dark";
      try { localStorage.setItem(THEME_KEY, state.theme); } catch (error) { showToast("Não foi possível salvar o tema neste navegador."); }
      render();
      app.querySelector('[data-action="toggle-theme"]')?.focus();
    }
    if (action === "explore-demo") go(state.role === "musico" ? "musician" : "explore");
    if (action === "switch-role") { state.role = state.role === "contratante" ? "musico" : "contratante"; go(state.role === "musico" ? "musician" : "explore"); }
    if (action === "profile") { state.artistId = control.dataset.id; go("profile"); }
    if (action === "request") { state.modal = { type: "request", id: control.dataset.id }; render(); }
    if (action === "favorite") {
      const id = control.dataset.id;
      saved.favorites = saved.favorites.includes(id) ? saved.favorites.filter((item) => item !== id) : [...saved.favorites, id];
      persist(); render(); showToast(saved.favorites.includes(id) ? "Adicionado aos salvos." : "Removido dos salvos.");
    }
    if (action === "show-favorites") { state.modal = { type: "favorites" }; render(); }
    if (action === "clear-filters") { Object.assign(state, { search: "", city: "", style: "", fee: "", availability: "" }); render(); }
    if (action === "new-opportunity") { state.modal = { type: "opportunity" }; render(); }
    if (action === "edit-profile") { state.modal = { type: "edit-profile" }; render(); }
    if (action === "close-modal") { state.modal = null; render(); }
    if (action === "close-backdrop" && event.target === control) { state.modal = null; render(); }
    if (action === "opportunity-interest") {
      const id = control.dataset.id;
      if (!saved.interests.includes(id)) saved.interests.push(id);
      persist(); state.modal = { type: "interest", id }; render();
    }
    if (action === "reset") {
      if (window.confirm("Restaurar os dados de demonstração? Favoritos, pedidos e anúncios locais serão apagados.")) {
        localStorage.removeItem(STORAGE_KEY); saved = defaults(); state.modal = null; state.page = "welcome"; state.role = "contratante"; render(); showToast("Dados iniciais restaurados.");
      }
    }
    if (action === "request-status") {
      const request = saved.requests.find((item) => item.id === control.dataset.id);
      if (request) { request.status = control.dataset.status; persist(); render(); showToast(`Solicitação ${request.status === "aceita" ? "aceita" : "recusada"}.`); }
    }
  });

  app.addEventListener("submit", (event) => {
    const form = event.target;
    const type = form.dataset.form;
    if (!type) return;
    event.preventDefault();
    if (type === "access") {
      if (state.signup) {
        const values = Object.fromEntries(new FormData(form));
        if (state.role === "musico") Object.assign(saved.profile, { name: values.name, city: values.city, instruments: values.instruments, styles: values.styles });
        persist();
      }
      go(state.role === "musico" ? "musician" : "explore");
      showToast(state.signup ? "Cadastro de demonstração concluído." : "Acesso de demonstração iniciado.");
    }
    if (type === "filters") {
      const values = Object.fromEntries(new FormData(form));
      Object.assign(state, { search: values.search || "", city: values.city || "", style: values.style || "", fee: values.fee || "", availability: values.availability || "" });
      render();
    }
    if (type === "request") {
      const values = Object.fromEntries(new FormData(form));
      const person = initialData.artists.find((item) => item.id === values.artistId) || initialData.artists[0];
      saved.requests.unshift({ ...values, id: `req-${Date.now()}`, artistName: person.name, budget: Number(values.budget), status: "pendente" });
      persist(); state.modal = null; go("explore"); showToast("Solicitação simulada enviada. Acesse o perfil músico para visualizá-la.");
    }
    if (type === "opportunity") {
      const values = Object.fromEntries(new FormData(form));
      saved.opportunities.unshift({ ...values, id: `opp-${Date.now()}`, budget: Number(values.budget || 0) });
      persist(); state.modal = null; go("opportunities"); showToast("Oportunidade publicada no mural local.");
    }
    if (type === "edit-profile") {
      const values = Object.fromEntries(new FormData(form));
      Object.assign(saved.profile, { ...values, price: Number(values.price) });
      persist(); state.modal = null; render(); showToast("Perfil atualizado neste navegador.");
    }
  });

  app.addEventListener("change", (event) => {
    const control = event.target;
    if (control.matches('[data-action="availability-toggle"]')) { saved.profile.available = control.checked; persist(); render(); showToast("Disponibilidade atualizada."); }
    if (control.matches('[data-action="day-toggle"]')) {
      const days = new Set(saved.profile.days);
      if (control.checked) days.add(control.value); else days.delete(control.value);
      saved.profile.days = [...days]; persist(); render();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && state.modal) { state.modal = null; render(); }
    if (event.key === "Tab" && state.modal) {
      const modal = app.querySelector(".modal");
      const focusable = [...modal.querySelectorAll('button, input, select, textarea, [href], [tabindex]:not([tabindex="-1"])')].filter((item) => !item.disabled);
      if (!focusable.length) return;
      if (event.shiftKey && document.activeElement === focusable[0]) { event.preventDefault(); focusable[focusable.length - 1].focus(); }
      else if (!event.shiftKey && document.activeElement === focusable[focusable.length - 1]) { event.preventDefault(); focusable[0].focus(); }
    }
  });

  render();
})();