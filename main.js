/* ═══════════════════════════════════════════════════════════════
   WORLDS — Main Application (Images Added)
   ═══════════════════════════════════════════════════════════════ */

import * as THREE from 'three';

/* ── UTILITIES ───────────────────────────────────────────────── */
const $  = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches;

function lerp(a, b, t) { return a + (b - a) * t; }

/* ── IMAGE SOURCES ───────────────────────────────────────────── */
/* Har game ke liye 2 source: Steam CDN + YouTube trailer frames.
   Jo image load ho jaye wohi dikhti hai, baqi automatically skip. */
const steam = (appId, file) =>
  `https://cdn.akamai.steamstatic.com/steam/apps/${appId}/${file}`;
const yt = (vid, file) => `https://i.ytimg.com/vi/${vid}/${file}`;

function buildSources(appId, vid) {
  return {
    hero: [
      steam(appId, 'library_hero.jpg'),
      steam(appId, 'page_bg_generated_v6b.jpg'),
      yt(vid, 'maxresdefault.jpg'),
      yt(vid, 'sddefault.jpg'),
      steam(appId, 'header.jpg')
    ],
    gallery: [
      steam(appId, 'page_bg_generated_v6b.jpg'),
      steam(appId, 'library_hero.jpg'),
      steam(appId, 'header.jpg'),
      steam(appId, 'capsule_616x353.jpg'),
      steam(appId, 'library_600x900.jpg'),
      yt(vid, 'maxresdefault.jpg'),
      yt(vid, 'maxres1.jpg'),
      yt(vid, 'maxres2.jpg'),
      yt(vid, 'maxres3.jpg'),
      yt(vid, 'hq1.jpg'),
      yt(vid, 'hq2.jpg'),
      yt(vid, 'hq3.jpg')
    ]
  };
}

function loadImage(url, timeout = 9000) {
  return new Promise((resolve) => {
    const img = new Image();
    let done = false;
    let timer = null;
    const finish = (ok) => {
      if (done) return;
      done = true;
      clearTimeout(timer);
      resolve(ok ? url : null);
    };
    timer = setTimeout(() => finish(false), timeout);
    img.onload = () => finish(img.naturalWidth >= 300);   // chhoti placeholder images reject
    img.onerror = () => finish(false);
    img.referrerPolicy = 'no-referrer';
    img.src = url;
  });
}

const imageCache = {};
function getGameImages(gameId) {
  if (!imageCache[gameId]) {
    const src = GAMES[gameId].sources;
    const urls = [...new Set([...src.hero, ...src.gallery])];
    imageCache[gameId] = Promise.all(urls.map((u) => loadImage(u))).then((res) => {
      const ok = new Set(res.filter(Boolean));
      return {
        hero: src.hero.find((u) => ok.has(u)) || null,
        all: src.gallery.filter((u) => ok.has(u))
      };
    });
  }
  return imageCache[gameId];
}

/* ── DATA: GAMES ─────────────────────────────────────────────── */
const GAMES = {
  ghost: {
    id: 'ghost',
    title: 'Ghost of Tsushima',
    tagline: 'Honor died on the battlefield. The Ghost was born in its place.',
    developer: 'Sucker Punch Productions',
    genre: 'Open World · Action Adventure',
    year: '2020',
    setting: 'Tsushima Island, Japan — 1274',
    heroGrad: ['#1a0a08', '#3d1410', '#6b2418', '#0d0605'],
    accent: '#d94a3d',
    accent2: '#f0a35e',
    theme: 'samurai-night',
    trailer: 'https://www.youtube.com/embed/b0WT4D7r3qM',
    trailerExternal: 'https://www.youtube.com/watch?v=b0WT4D7r3qM',
    trailerTitle: 'Ghost of Tsushima — Official Story Trailer',
    sources: buildSources(2215430, 'b0WT4D7r3qM'),
    characterImages: {},
    stats: [
      { label: 'Developer', value: 'Sucker Punch' },
      { label: 'Released', value: '2020' },
      { label: 'Setting', value: '1274 · Tsushima' },
      { label: 'Platforms', value: 'PS4 · PS5 · PC' }
    ],
    story: [
      { icon: 'swords', title: 'The Samurai', text: 'Jin Sakai is one of the last samurai on Tsushima Island. When the Mongol fleet invades, his world is shattered and his code of honour is tested beyond breaking point.' },
      { icon: 'ghost',  title: 'The Ghost',  text: 'To save his people, Jin must abandon the samurai way and adopt methods he was taught to despise. The Ghost is not a hero — it is a necessity born of war.' },
      { icon: 'map',    title: 'The Island', text: 'A sprawling open world of wind-swept fields, bamboo forests, mountain shrines and war-torn villages. Every horizon invites exploration.' }
    ],
    characters: [
      { name: 'Jin Sakai',    role: 'The Ghost',    desc: 'A samurai who sacrifices his honour to protect his home. His journey is one of transformation, loss and reluctant heroism.', initials: 'JS' },
      { name: 'Yuna',         role: 'Ally',          desc: 'A thief who saves Jin and teaches him the ways of stealth. Practical, fierce, and driven by her own losses.', initials: 'YU' },
      { name: 'Lord Shimura', role: 'Jin\'s Uncle', desc: 'A traditional samurai who clings to the old code. His relationship with Jin forms the emotional core of the story.', initials: 'LS' }
    ],
    gameplay: [
      { title: 'Samurai Combat', text: 'Precise, lethal swordplay with four stances to master against different enemy types.' },
      { title: 'Stealth',        text: 'Become the Ghost — use distraction, assassination and the shadows to thin out enemy camps.' },
      { title: 'Exploration',    text: 'Follow the wind, not a minimap. The world is designed to be discovered, not ticked off.' },
      { title: 'Sword Fighting', text: 'Standoffs, parries, and cinematic duels that reward timing and patience.' },
      { title: 'Open World',     text: 'A living island with dynamic weather, wildlife and countless stories waiting to be found.' }
    ]
  },

  tlou: {
    id: 'tlou',
    title: 'The Last of Us',
    tagline: 'When you\'re lost in the darkness, look for the light.',
    developer: 'Naughty Dog',
    genre: 'Action Adventure · Survival',
    year: '2013',
    setting: 'Post-Pandemic America',
    heroGrad: ['#0a1410', '#0f2b1e', '#1a4d32', '#050a08'],
    accent: '#3d8b6a',
    accent2: '#7fbf8f',
    theme: 'post-apocalyptic',
    trailer: 'https://www.youtube.com/embed/W01L70IGBgE',
    trailerExternal: 'https://www.youtube.com/watch?v=W01L70IGBgE',
    trailerTitle: 'The Last of Us — Official Story Trailer',
    sources: buildSources(1888930, 'W01L70IGBgE'),
    characterImages: {},
    stats: [
      { label: 'Developer', value: 'Naughty Dog' },
      { label: 'Released',  value: '2013' },
      { label: 'Setting',   value: 'Post-Pandemic USA' },
      { label: 'Platforms', value: 'PS3 · PS4 · PS5 · PC' }
    ],
    story: [
      { icon: 'biohazard', title: 'The Outbreak', text: 'A fungal infection has collapsed civilisation. Cities are quarantined ruins, nature is reclaiming everything, and the infected are not the only threat.' },
      { icon: 'users',     title: 'Joel & Ellie', text: 'A hardened smuggler is hired to escort a teenage girl across the country. What begins as a job becomes the most important relationship of both their lives.' },
      { icon: 'heart',     title: 'Humanity',     text: 'In a world stripped of rules, the monsters are often human. The Last of Us is a story about love, loss, and what we do to protect the people we care about.' }
    ],
    characters: [
      { name: 'Joel Miller', role: 'Protagonist', desc: 'A smuggler haunted by loss. He is brutal, tired, and will do anything to keep Ellie safe.', initials: 'JM' },
      { name: 'Ellie',       role: 'Companion',   desc: 'A teenage girl who is immune to the infection. She is brave, curious, and carries the weight of a possible cure.', initials: 'EL' },
      { name: 'Tess',        role: 'Partner',     desc: 'Joel\'s smuggling partner. Tough, pragmatic, and willing to make the hard choices that others cannot.', initials: 'TS' }
    ],
    gameplay: [
      { title: 'Survival',    text: 'Every bullet, bandage and bottle matters. Resources are scarce and every encounter is a risk.' },
      { title: 'Stealth',     text: 'Avoid conflict when you can. Use cover, distraction and silence to survive against both infected and humans.' },
      { title: 'Crafting',    text: 'Scavenge materials and craft medkits, Molotovs, shivs and smoke bombs on the fly.' },
      { title: 'Exploration', text: 'Search abandoned buildings for supplies, notes and environmental storytelling.' },
      { title: 'Combat',      text: 'Brutal, desperate and grounded. Melee weapons break, ammo runs out, and escape is often the best option.' }
    ]
  },

  rdr2: {
    id: 'rdr2',
    title: 'Red Dead Redemption 2',
    tagline: 'America, 1899. The end of the outlaw era.',
    developer: 'Rockstar Games',
    genre: 'Open World · Action Adventure',
    year: '2018',
    setting: 'American Frontier — 1899',
    heroGrad: ['#1a1208', '#3d2a12', '#6b4a1e', '#0d0905'],
    accent: '#d99a3d',
    accent2: '#f0c05e',
    theme: 'wild-west-sunset',
    trailer: 'https://www.youtube.com/embed/eaW0tYpxyp0',
    trailerExternal: 'https://www.youtube.com/watch?v=eaW0tYpxyp0',
    trailerTitle: 'Red Dead Redemption 2 — Official Trailer',
    sources: buildSources(1174180, 'eaW0tYpxyp0'),
    characterImages: {},
    stats: [
      { label: 'Developer', value: 'Rockstar Games' },
      { label: 'Released',  value: '2018' },
      { label: 'Setting',   value: '1899 · American Frontier' },
      { label: 'Platforms', value: 'PS4 · Xbox One · PC' }
    ],
    story: [
      { icon: 'gun',    title: 'The Gang',     text: 'Arthur Morgan is a senior member of the Van der Linde gang — a family of outlaws trying to survive as the Wild West is civilised out of existence.' },
      { icon: 'horse',  title: 'The Frontier', text: 'A vast, detailed open world of mountains, plains, swamps and towns. Nature is beautiful, indifferent, and full of danger.' },
      { icon: 'sunset', title: 'The End',      text: 'The age of outlaws is ending. Arthur must reckon with his own morality as the world changes around him and the gang begins to fracture.' }
    ],
    characters: [
      { name: 'Arthur Morgan',       role: 'Protagonist',  desc: 'A loyal enforcer with a conscience he can\'t quite silence. His story is one of redemption, loyalty, and inevitable change.', initials: 'AM' },
      { name: 'Dutch van der Linde', role: 'Gang Leader',  desc: 'Charismatic, idealistic, and increasingly unhinged. He believes he is fighting for freedom — but the dream is crumbling.', initials: 'DV' },
      { name: 'John Marston',        role: 'Ally',         desc: 'A younger member of the gang who will one day become the protagonist of Red Dead Redemption. Loyal, reckless, and trying to be a better man.', initials: 'JM' }
    ],
    gameplay: [
      { title: 'Horse Riding', text: 'Your horse is your lifeline — bond with it, care for it, and it will carry you across the frontier.' },
      { title: 'Exploration',  text: 'A world of extraordinary detail. Hunt, fish, gamble, rob, or simply watch the sunset.' },
      { title: 'Hunting',      text: 'Track animals, use the right weapon, and sell pelts to craft gear or survive in the wild.' },
      { title: 'Gunfights',    text: 'Cinematic Dead Eye targeting, cover-based combat, and tense standoffs with rival gangs and lawmen.' },
      { title: 'Open World',   text: 'Every NPC has a routine. Every stranger is a story. The world reacts to who you are and what you do.' }
    ]
  }
};

/* ── DATA: THEMES ────────────────────────────────────────────── */
const THEMES = [
  { id: 'samurai-night', name: 'Samurai Night', game: 'Ghost of Tsushima', gameId: 'ghost',
    vars: { '--bg':'#06070b','--accent':'#d94a3d','--accent-2':'#f0a35e','--accent-glow':'rgba(217, 74, 61, 0.35)',
            '--hero-grad-1':'#1a0a08','--hero-grad-2':'#3d1410','--hero-grad-3':'#6b2418','--hero-grad-4':'#0d0605' },
    particles: { color: 0xd94a3d, size: 0.018, count: 1200, speed: 0.15 } },
  { id: 'crimson-autumn', name: 'Crimson Autumn', game: 'Ghost of Tsushima', gameId: 'ghost',
    vars: { '--bg':'#0b0605','--accent':'#e05a2b','--accent-2':'#f5b06a','--accent-glow':'rgba(224, 90, 43, 0.4)',
            '--hero-grad-1':'#1a0a05','--hero-grad-2':'#4d1a0a','--hero-grad-3':'#8a3314','--hero-grad-4':'#0d0503' },
    particles: { color: 0xe05a2b, size: 0.022, count: 1400, speed: 0.2 } },
  { id: 'moonlit-japan', name: 'Moonlit Japan', game: 'Ghost of Tsushima', gameId: 'ghost',
    vars: { '--bg':'#05070d','--accent':'#5a7fd9','--accent-2':'#a0c0f0','--accent-glow':'rgba(90, 127, 217, 0.35)',
            '--hero-grad-1':'#080a14','--hero-grad-2':'#0f1a3d','--hero-grad-3':'#1a2d6b','--hero-grad-4':'#05070d' },
    particles: { color: 0x5a7fd9, size: 0.015, count: 1000, speed: 0.1 } },
  { id: 'post-apocalyptic', name: 'Post-Apocalyptic', game: 'The Last of Us', gameId: 'tlou',
    vars: { '--bg':'#050a08','--accent':'#3d8b6a','--accent-2':'#7fbf8f','--accent-glow':'rgba(61, 139, 106, 0.35)',
            '--hero-grad-1':'#0a1410','--hero-grad-2':'#0f2b1e','--hero-grad-3':'#1a4d32','--hero-grad-4':'#050a08' },
    particles: { color: 0x3d8b6a, size: 0.02, count: 1300, speed: 0.12 } },
  { id: 'dark-survival', name: 'Dark Survival', game: 'The Last of Us', gameId: 'tlou',
    vars: { '--bg':'#080505','--accent':'#8b3d3d','--accent-2':'#bf7f7f','--accent-glow':'rgba(139, 61, 61, 0.4)',
            '--hero-grad-1':'#140a0a','--hero-grad-2':'#2b0f0f','--hero-grad-3':'#4d1a1a','--hero-grad-4':'#080505' },
    particles: { color: 0x8b3d3d, size: 0.018, count: 1100, speed: 0.14 } },
  { id: 'wild-west-sunset', name: 'Wild West Sunset', game: 'Red Dead Redemption 2', gameId: 'rdr2',
    vars: { '--bg':'#0d0905','--accent':'#d99a3d','--accent-2':'#f0c05e','--accent-glow':'rgba(217, 154, 61, 0.4)',
            '--hero-grad-1':'#1a1208','--hero-grad-2':'#3d2a12','--hero-grad-3':'#6b4a1e','--hero-grad-4':'#0d0905' },
    particles: { color: 0xd99a3d, size: 0.02, count: 1250, speed: 0.18 } },
  { id: 'midnight-frontier', name: 'Midnight Frontier', game: 'Red Dead Redemption 2', gameId: 'rdr2',
    vars: { '--bg':'#05060a','--accent':'#7a5ad9','--accent-2':'#b09af0','--accent-glow':'rgba(122, 90, 217, 0.35)',
            '--hero-grad-1':'#080a14','--hero-grad-2':'#0f103d','--hero-grad-3':'#1e1a6b','--hero-grad-4':'#05060a' },
    particles: { color: 0x7a5ad9, size: 0.016, count: 1050, speed: 0.12 } }
];

/* ── STATE ───────────────────────────────────────────────────── */
const state = {
  activeGame: 'ghost',
  activeTheme: 'samurai-night',
  scene: null, camera: null, renderer: null,
  stars: null, planet: null, planetMat: null, planetGlow: null, planetRing: null,
  dust: null, dustMat: null,
  mouse: { x: 0, y: 0 },
  targetMouse: { x: 0, y: 0 },
  scrollY: 0,
  heroLayer: 'a',
  webglOK: true
};

/* ── DOM REFS ────────────────────────────────────────────────── */
const dom = {
  loader: $('#loader'), loaderBar: $('#loaderBar'), loaderPct: $('#loaderPct'),
  loaderStatus: $('#loaderStatus'), loaderHint: $('#loaderHint'),
  nav: $('#nav'), burger: $('#burger'), mobileMenu: $('#mobileMenu'),
  navThemeBtn: $('#navThemeBtn'), mobileThemeBtn: $('#mobileThemeBtn'),
  themeFab: $('#themeFab'), themePanel: $('#themePanel'), themePanelBody: $('#themePanelBody'),
  themePanelClose: $('#themePanelClose'), themeReset: $('#themeReset'),
  heroTitle: $('#heroTitle'), heroTagline: $('#heroTagline'), heroMeta: $('#heroMeta'),
  heroEyebrow: $('#heroEyebrow'),
  heroLayerA: $('.hero__layer[data-layer="a"]'),
  heroLayerB: $('.hero__layer[data-layer="b"]'),
  heroSelector: $('.hero__selector'),
  exploreBtn: $('#exploreBtn'), trailerBtn: $('#trailerBtn'),
  dossierTitle: $('#dossierTitle'), dossierSub: $('#dossierSub'),
  statGrid: $('#statGrid'), storyGrid: $('#storyGrid'),
  charSub: $('#charSub'), charGrid: $('#charGrid'),
  gameplaySub: $('#gameplaySub'), playGrid: $('#playGrid'),
  themeGrid: $('#themeGrid'), trailerGrid: $('#trailerGrid'),
  gallerySub: $('#gallerySub'), galleryGrid: $('#galleryGrid'),
  modal: $('#trailerModal'), modalTitle: $('#modalTitle'), modalSub: $('#modalSub'),
  modalFrame: $('#modalFrame'), modalPlaceholder: $('#modalPlaceholder'),
  modalExternal: $('#modalExternal'), modalClose: $('#modalClose'),
  toast: $('#toast'), scrollBar: $('#scrollBar'),
  aboutTheme: $('#aboutTheme'), aboutGame: $('#aboutGame'),
  aboutParticles: $('#aboutParticles'), aboutRenderer: $('#aboutRenderer'),
  aboutMotion: $('#aboutMotion'), year: $('#year')
};

/* ═══════════════════════════════════════════════════════════════
   THREE.JS — STARS + PLANET
   ═══════════════════════════════════════════════════════════════ */
function initThree() {
  const canvas = $('#bg-canvas');
  if (!canvas) return;

  try {
    state.scene = new THREE.Scene();
    state.scene.fog = new THREE.FogExp2(0x06070b, 0.0008);

    state.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 3000);
    state.camera.position.set(0, 0, 18);

    state.renderer = new THREE.WebGLRenderer({
      canvas, antialias: false, alpha: true, powerPreference: 'high-performance'
    });
    state.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    state.renderer.setSize(window.innerWidth, window.innerHeight);
    state.renderer.setClearColor(0x000000, 0);

    /* STARS */
    const starCount = prefersReducedMotion ? 1500 : 4500;
    const starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(starCount * 3);
    const starCol = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
      const r = 400 + Math.random() * 800;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      starPos[i*3]   = r * Math.sin(phi) * Math.cos(theta);
      starPos[i*3+1] = r * Math.sin(phi) * Math.sin(theta);
      starPos[i*3+2] = r * Math.cos(phi);
      const c = 0.7 + Math.random() * 0.3;
      starCol[i*3] = c; starCol[i*3+1] = c; starCol[i*3+2] = 1.0;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    starGeo.setAttribute('color', new THREE.BufferAttribute(starCol, 3));

    state.stars = new THREE.Points(starGeo, new THREE.PointsMaterial({
      size: 1.6, vertexColors: true, transparent: true, opacity: 0.9,
      blending: THREE.AdditiveBlending, depthWrite: false, sizeAttenuation: true
    }));
    state.scene.add(state.stars);

    /* PLANET */
    state.planetMat = new THREE.MeshStandardMaterial({
      color: 0x1a0a08, emissive: 0x3d1410, emissiveIntensity: 0.4,
      roughness: 0.8, metalness: 0.1
    });
    state.planet = new THREE.Mesh(new THREE.SphereGeometry(3.5, 64, 64), state.planetMat);
    state.planet.position.set(-14, 6, -30);
    state.scene.add(state.planet);

    /* GLOW SPRITE */
    state.planetGlow = new THREE.Sprite(new THREE.SpriteMaterial({
      map: makeGlowTexture('217, 74, 61'),
      blending: THREE.AdditiveBlending, transparent: true, depthWrite: false
    }));
    state.planetGlow.scale.set(14, 14, 1);
    state.planetGlow.position.copy(state.planet.position);
    state.scene.add(state.planetGlow);

    /* RING */
    state.planetRing = new THREE.Mesh(
      new THREE.RingGeometry(4.5, 6.5, 64),
      new THREE.MeshBasicMaterial({
        color: 0xd94a3d, transparent: true, opacity: 0.25,
        side: THREE.DoubleSide, blending: THREE.AdditiveBlending
      })
    );
    state.planetRing.rotation.x = Math.PI / 2.4;
    state.planetRing.rotation.z = Math.PI / 6;
    state.planetRing.position.copy(state.planet.position);
    state.scene.add(state.planetRing);

    /* DUST */
    const dustCount = prefersReducedMotion ? 300 : 900;
    const dustGeo = new THREE.BufferGeometry();
    const dustPos = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount; i++) {
      dustPos[i*3]   = (Math.random() - 0.5) * 80;
      dustPos[i*3+1] = (Math.random() - 0.5) * 80;
      dustPos[i*3+2] = (Math.random() - 0.5) * 80;
    }
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));

    state.dustMat = new THREE.PointsMaterial({
      color: 0xd94a3d, size: 0.08, transparent: true, opacity: 0.35,
      blending: THREE.AdditiveBlending, depthWrite: false
    });
    state.dust = new THREE.Points(dustGeo, state.dustMat);
    state.scene.add(state.dust);

    /* LIGHTS */
    state.scene.add(new THREE.AmbientLight(0xffffff, 0.15));
    const sunLight = new THREE.PointLight(0xf0a35e, 1.2, 200);
    sunLight.position.set(-20, 10, -20);
    state.scene.add(sunLight);

    window.addEventListener('resize', onResize);
    document.addEventListener('mousemove', onMouseMove);

    animate();
  } catch (e) {
    console.warn('WebGL not available — falling back to CSS.', e);
    state.webglOK = false;
    if (dom.aboutRenderer) dom.aboutRenderer.textContent = 'CSS Fallback';
  }
}

/* Helper — glow texture */
function makeGlowTexture(rgbString) {
  const c = document.createElement('canvas');
  c.width = 256; c.height = 256;
  const ctx = c.getContext('2d');
  const grad = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
  grad.addColorStop(0, `rgba(${rgbString}, 0.6)`);
  grad.addColorStop(0.4, `rgba(${rgbString}, 0.15)`);
  grad.addColorStop(1, `rgba(${rgbString}, 0)`);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 256, 256);
  return new THREE.CanvasTexture(c);
}

function onResize() {
  if (!state.renderer || !state.camera) return;
  state.camera.aspect = window.innerWidth / window.innerHeight;
  state.camera.updateProjectionMatrix();
  state.renderer.setSize(window.innerWidth, window.innerHeight);
  state.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
}

function onMouseMove(e) {
  state.targetMouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  state.targetMouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
}

let lastTime = 0;
function animate(time = 0) {
  requestAnimationFrame(animate);
  if (!state.renderer || !state.scene || !state.camera) return;

  const dt = Math.min((time - lastTime) / 1000, 0.05);
  lastTime = time;

  state.mouse.x = lerp(state.mouse.x, state.targetMouse.x, 0.05);
  state.mouse.y = lerp(state.mouse.y, state.targetMouse.y, 0.05);

  state.camera.position.x = state.mouse.x * 2.0;
  state.camera.position.y = state.mouse.y * 1.2;
  state.camera.lookAt(0, 0, 0);

  if (state.stars) {
    state.stars.rotation.y += 0.00008;
    state.stars.rotation.x += 0.00003;
  }
  if (state.planet) state.planet.rotation.y += 0.0006;
  if (state.planetRing) state.planetRing.rotation.z += 0.0002;

  if (state.dust) {
    const pos = state.dust.geometry.attributes.position.array;
    const step = 0.5 * dt; // framerate-independent
    for (let i = 1; i < pos.length; i += 3) {
      pos[i] += step;
      if (pos[i] > 40) pos[i] = -40;
    }
    state.dust.geometry.attributes.position.needsUpdate = true;
    state.dust.rotation.y += 0.0002;
  }

  state.renderer.render(state.scene, state.camera);
}

/* ── THEME ENGINE ────────────────────────────────────────────── */
function applyTheme(themeId, { silent = false } = {}) {
  const theme = THEMES.find(t => t.id === themeId);
  if (!theme) return;

  state.activeTheme = themeId;
  document.documentElement.setAttribute('data-theme', themeId);

  const root = document.documentElement;
  Object.entries(theme.vars).forEach(([k, v]) => root.style.setProperty(k, v));

  if (state.planetMat) state.planetMat.emissive.setHex(theme.particles.color);
  if (state.planetRing) state.planetRing.material.color.setHex(theme.particles.color);
  if (state.dustMat) state.dustMat.color.setHex(theme.particles.color);

  // Rebuild glow sprite with new color
  if (state.planetGlow) {
    const c = new THREE.Color(theme.particles.color);
    const rgb = `${Math.round(c.r*255)}, ${Math.round(c.g*255)}, ${Math.round(c.b*255)}`;
    if (state.planetGlow.material.map) state.planetGlow.material.map.dispose();
    state.planetGlow.material.map = makeGlowTexture(rgb);
    state.planetGlow.material.needsUpdate = true;
  }

  if (state.scene && state.scene.fog) {
    const bg = theme.vars['--bg'];
    if (bg) state.scene.fog.color.setHex(parseInt(bg.replace('#', ''), 16));
  }

  if (dom.aboutTheme) dom.aboutTheme.textContent = theme.name;

  if (theme.gameId && theme.gameId !== state.activeGame) {
    selectGame(theme.gameId, { silent: true });
  }

  if (!silent) {
    try { localStorage.setItem('worlds-theme', themeId); } catch (e) {}
    renderThemePanel();
  }
}

/* ── GAME ENGINE ─────────────────────────────────────────────── */
function selectGame(gameId, { silent = false } = {}) {
  const game = GAMES[gameId];
  if (!game) return;

  state.activeGame = gameId;

  const currentLayer = state.heroLayer === 'a' ? dom.heroLayerA : dom.heroLayerB;
  const nextLayer = state.heroLayer === 'a' ? dom.heroLayerB : dom.heroLayerA;

  /* Hero background: gradient first, then swap in image if it loads */
  const gradientBg = `radial-gradient(ellipse at 30% 40%, ${game.heroGrad[2]} 0%, ${game.heroGrad[1]} 35%, ${game.heroGrad[0]} 65%, ${game.heroGrad[3]} 100%)`;
  nextLayer.style.background = gradientBg;

  nextLayer.dataset.game = gameId;
  getGameImages(gameId).then(({ hero }) => {
    if (hero && nextLayer.dataset.game === gameId) {
      nextLayer.style.background =
        `linear-gradient(rgba(6,7,11,0.55), rgba(6,7,11,0.85)), url("${hero}") center/cover no-repeat`;
    }
  });

  nextLayer.classList.add('is-active');
  currentLayer.classList.remove('is-active');
  state.heroLayer = state.heroLayer === 'a' ? 'b' : 'a';

  const updateText = () => {
    dom.heroTitle.textContent = game.title;
    dom.heroTagline.textContent = game.tagline;
    dom.heroMeta.innerHTML = `
      <span>${game.developer}</span>
      <span class="dot"></span>
      <span>${game.genre}</span>
      <span class="dot"></span>
      <span>${game.year}</span>
    `;
  };

  if (window.gsap && !prefersReducedMotion && !silent) {
    gsap.timeline({ defaults: { ease: 'power3.out' } })
      .to([dom.heroTitle, dom.heroTagline, dom.heroMeta], {
        opacity: 0, y: -12, duration: 0.3, stagger: 0.04,
        onComplete: () => {
          updateText();
          gsap.to([dom.heroTitle, dom.heroTagline, dom.heroMeta], {
            opacity: 1, y: 0, duration: 0.6, stagger: 0.06
          });
        }
      });
  } else {
    updateText();
  }

  // Sync theme
  const theme = THEMES.find(t => t.id === state.activeTheme);
  if (!(theme && theme.gameId === gameId)) {
    const gameTheme = THEMES.find(t => t.gameId === gameId);
    if (gameTheme) applyTheme(gameTheme.id, { silent: true });
  }

  renderGameSelector();
  renderDossier(game);
  renderCharacters(game);
  renderGameplay(game);
  renderGallery(game);

  if (dom.aboutGame) dom.aboutGame.textContent = game.title;
  dom.trailerBtn.onclick = () => openTrailer(gameId);

  if (window.lucide) window.lucide.createIcons();

  if (!silent) {
    try { localStorage.setItem('worlds-game', gameId); } catch (e) {}
  }
}

/* ── RENDERERS ───────────────────────────────────────────────── */
function renderGameSelector() {
  dom.heroSelector.innerHTML = Object.values(GAMES).map((g, i) => `
    <button class="game-chip ${g.id === state.activeGame ? 'is-active' : ''}" data-game="${g.id}" role="tab" aria-selected="${g.id === state.activeGame}">
      <span class="game-chip__idx">0${i + 1}</span>
      <span class="game-chip__name">${g.title}</span>
      <span class="game-chip__tag">${g.genre.split(' · ')[0]}</span>
    </button>
  `).join('');

  $$('.game-chip', dom.heroSelector).forEach(chip => {
    chip.addEventListener('click', () => selectGame(chip.dataset.game));
  });
}

function renderDossier(game) {
  dom.dossierTitle.textContent = game.title;
  dom.dossierSub.textContent = `${game.developer} · ${game.setting}`;
  dom.statGrid.innerHTML = game.stats.map(s => `
    <div class="stat">
      <div class="stat__label">${s.label}</div>
      <div class="stat__value">${s.value}</div>
    </div>`).join('');
  dom.storyGrid.innerHTML = game.story.map(s => `
    <article class="story-card">
      <div class="story-card__icon"><i data-lucide="${s.icon}"></i></div>
      <h3 class="story-card__title">${s.title}</h3>
      <p class="story-card__text">${s.text}</p>
    </article>`).join('');
}

function renderCharacters(game) {
  dom.charSub.textContent = `The people who define ${game.title}.`;
  dom.charGrid.innerHTML = game.characters.map(c => {
    const img = game.characterImages && game.characterImages[c.name];
    const visual = img
      ? `<img src="${img}" alt="${c.name}" loading="lazy" onerror="this.style.display='none';this.nextElementSibling.style.display='flex';" />
         <span class="char-card__initials" style="display:none;">${c.initials || c.name.split(' ').map(w => w[0]).join('')}</span>`
      : `<span class="char-card__initials">${c.initials || c.name.split(' ').map(w => w[0]).join('')}</span>`;
    return `
      <article class="char-card">
        <div class="char-card__visual">${visual}</div>
        <div class="char-card__body">
          <h3 class="char-card__name">${c.name}</h3>
          <p class="char-card__role">${c.role}</p>
          <p class="char-card__desc">${c.desc}</p>
        </div>
      </article>`;
  }).join('');
}

function renderGameplay(game) {
  dom.gameplaySub.textContent = `Core systems and mechanics in ${game.title}.`;
  dom.playGrid.innerHTML = game.gameplay.map((p, i) => `
    <article class="play-card">
      <span class="play-card__num">0${i + 1}</span>
      <h3 class="play-card__title">${p.title}</h3>
      <p class="play-card__text">${p.text}</p>
    </article>`).join('');
}

async function renderGallery(game) {
  const grid = dom.galleryGrid;
  if (!grid) return;
  const SLOTS = 6;
  if (dom.gallerySub) dom.gallerySub.textContent = `Official visuals from ${game.title} and its world.`;

  const gradient = (g) => `radial-gradient(ellipse at 30% 40%, ${g.heroGrad[2]} 0%, ${g.heroGrad[1]} 40%, ${g.heroGrad[0]} 100%)`;
  const fallbackTile = (g) => `
    <div class="gallery-item" style="background:${gradient(g)};display:flex;align-items:center;justify-content:center;min-height:180px;color:#fff;font-weight:600;letter-spacing:.12em;text-transform:uppercase;text-align:center;padding:1rem;">
      ${g.title}
    </div>`;

  grid.dataset.game = game.id;
  grid.innerHTML = Array.from({ length: SLOTS }, () => fallbackTile(game)).join('');

  const own = (await getGameImages(game.id)).all;
  const pool = own.slice(0, SLOTS).map((url) => ({ url, title: game.title }));

  // Kam images hon to baqi games ki images mix kar do, taake koi block khali na rahe
  if (pool.length < SLOTS) {
    const others = await Promise.all(
      Object.values(GAMES).filter((g) => g.id !== game.id).map(async (g) => ({
        g, imgs: (await getGameImages(g.id)).all
      }))
    );
    let idx = 0;
    while (pool.length < SLOTS && others.some((o) => idx < o.imgs.length)) {
      for (const o of others) {
        if (pool.length < SLOTS && idx < o.imgs.length) pool.push({ url: o.imgs[idx], title: o.g.title });
      }
      idx++;
    }
  }

  if (grid.dataset.game !== game.id) return;   // user ne beech mein game badal diya

  grid.innerHTML = Array.from({ length: SLOTS }, (_, i) => {
    const item = pool[i];
    if (!item) return fallbackTile(game);
    return `
      <div class="gallery-item" data-index="${i}" style="background:${gradient(game)};">
        <img src="${item.url}" alt="${item.title} visual ${i + 1}" loading="lazy" referrerpolicy="no-referrer"
             style="width:100%;height:100%;object-fit:cover;display:block;"
             onerror="this.style.display='none';" />
      </div>`;
  }).join('');
}

function renderThemeGrid() {
  dom.themeGrid.innerHTML = THEMES.map(t => `
    <button class="theme-card ${t.id === state.activeTheme ? 'is-active' : ''}" data-theme="${t.id}">
      <div class="theme-card__swatch" style="background: linear-gradient(135deg, ${t.vars['--accent']}, ${t.vars['--accent-2']}, ${t.vars['--hero-grad-2']})"></div>
      <div class="theme-card__name">${t.name}</div>
      <div class="theme-card__game">${t.game}</div>
    </button>`).join('');

  $$('.theme-card', dom.themeGrid).forEach(card => {
    card.addEventListener('click', () => {
      applyTheme(card.dataset.theme);
      renderThemeGrid();
    });
  });
}

function renderThemePanel() {
  dom.themePanelBody.innerHTML = THEMES.map(t => `
    <button class="theme-option ${t.id === state.activeTheme ? 'is-active' : ''}" data-theme="${t.id}">
      <span class="theme-option__swatch" style="background: linear-gradient(135deg, ${t.vars['--accent']}, ${t.vars['--accent-2']}, ${t.vars['--hero-grad-2']})"></span>
      <span class="theme-option__info">
        <span class="theme-option__name">${t.name}</span>
        <span class="theme-option__game">${t.game}</span>
      </span>
    </button>`).join('');

  $$('.theme-option', dom.themePanelBody).forEach(btn => {
    btn.addEventListener('click', () => {
      const theme = THEMES.find(t => t.id === btn.dataset.theme);
      applyTheme(btn.dataset.theme);
      renderThemeGrid();
      closeThemePanel();
      if (theme) showToast(`Theme: ${theme.name}`);
    });
  });
}

function renderTrailers() {
  dom.trailerGrid.innerHTML = Object.values(GAMES).map(g => `
      <article class="trailer-card" data-game="${g.id}">
        <div class="trailer-card__thumb" style="background:radial-gradient(ellipse at 30% 40%, ${g.heroGrad[2]} 0%, ${g.heroGrad[1]} 45%, ${g.heroGrad[0]} 100%);">
          <div class="trailer-card__play"><i data-lucide="play"></i></div>
        </div>
        <div class="trailer-card__body">
          <h3 class="trailer-card__title">${g.title}</h3>
          <p class="trailer-card__meta">Official Trailer · ${g.year}</p>
        </div>
      </article>`).join('');

  $$('.trailer-card', dom.trailerGrid).forEach(card => {
    card.addEventListener('click', () => openTrailer(card.dataset.game));
  });

  Object.values(GAMES).forEach(g => {
    getGameImages(g.id).then(({ hero }) => {
      const thumb = $(`.trailer-card[data-game="${g.id}"] .trailer-card__thumb`, dom.trailerGrid);
      if (thumb && hero) {
        thumb.style.background = `linear-gradient(rgba(0,0,0,0.4),rgba(0,0,0,0.7)), url("${hero}") center/cover no-repeat`;
      }
    });
  });
}

/* ── TRAILER MODAL ───────────────────────────────────────────── */
function openTrailer(gameId) {
  const game = GAMES[gameId];
  if (!game) return;

  dom.modalTitle.textContent = game.trailerTitle;
  dom.modalSub.textContent = game.developer + ' · Official';
  dom.modalExternal.href = game.trailerExternal;

  const existing = dom.modalFrame.querySelector('iframe');
  if (existing) existing.remove();

  dom.modalPlaceholder.style.display = 'flex';
  dom.modal.classList.add('is-open');
  document.body.classList.add('no-scroll');
  dom.modal.setAttribute('aria-hidden', 'false');

  setTimeout(() => {
    const iframe = document.createElement('iframe');
    iframe.src = game.trailer + '?autoplay=1&rel=0&modestbranding=1';
    iframe.title = game.trailerTitle;
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
    iframe.allowFullscreen = true;
    iframe.loading = 'lazy';
    iframe.addEventListener('load', () => { dom.modalPlaceholder.style.display = 'none'; });
    dom.modalFrame.appendChild(iframe);
  }, 300);
}

function closeTrailer() {
  dom.modal.classList.remove('is-open');
  dom.modal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('no-scroll');
  const iframe = dom.modalFrame.querySelector('iframe');
  if (iframe) iframe.remove();
  dom.modalPlaceholder.style.display = 'flex';
}

/* ── PANEL / MENU ────────────────────────────────────────────── */
function openThemePanel() {
  dom.themePanel.classList.add('is-open');
  dom.themePanel.setAttribute('aria-hidden', 'false');
  dom.themeFab.setAttribute('aria-expanded', 'true');
}
function closeThemePanel() {
  dom.themePanel.classList.remove('is-open');
  dom.themePanel.setAttribute('aria-hidden', 'true');
  dom.themeFab.setAttribute('aria-expanded', 'false');
}
function toggleMobileMenu() {
  const isOpen = dom.mobileMenu.classList.toggle('is-open');
  dom.burger.classList.toggle('is-open', isOpen);
  dom.burger.setAttribute('aria-expanded', isOpen);
  dom.mobileMenu.setAttribute('aria-hidden', !isOpen);
  document.body.classList.toggle('no-scroll', isOpen);
}
function closeMobileMenu() {
  dom.mobileMenu.classList.remove('is-open');
  dom.burger.classList.remove('is-open');
  dom.burger.setAttribute('aria-expanded', 'false');
  dom.mobileMenu.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('no-scroll');
}

/* ── SCROLL / SMOOTH ─────────────────────────────────────────── */
function initSmoothScroll() {
  $$('a[href^="#"], [data-scroll]').forEach(el => {
    el.addEventListener('click', (e) => {
      const target = el.dataset.scroll || el.getAttribute('href');
      if (!target || target === '#') return;
      const targetEl = $(target);
      if (!targetEl) return;
      e.preventDefault();
      closeMobileMenu();
      const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 68;
      const top = targetEl.getBoundingClientRect().top + window.scrollY - navH;
      window.scrollTo({ top, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    });
  });
}

function onScroll() {
  const sy = window.scrollY;
  state.scrollY = sy;
  dom.nav.classList.toggle('is-scrolled', sy > 40);
  const h = document.documentElement.scrollHeight - window.innerHeight;
  dom.scrollBar.style.width = (h > 0 ? (sy / h) * 100 : 0) + '%';

  const sections = ['home','games','characters','gameplay','themes','trailers','gallery','about'];
  let current = 'home';
  for (const id of sections) {
    const el = document.getElementById(id);
    if (el && el.getBoundingClientRect().top <= 120) current = id;
  }
  $$('.nav__link').forEach(link => {
    link.classList.toggle('is-active', link.getAttribute('href') === '#' + current);
  });
}

function initReveal() {
  const els = $$('.reveal');
  if (!els.length) return;
  if (prefersReducedMotion) { els.forEach(el => el.classList.add('is-visible')); return; }
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  els.forEach(el => io.observe(el));
}

/* ── CURSOR ──────────────────────────────────────────────────── */
function initCursor() {
  if (isTouch || prefersReducedMotion) return;
  const cursor = $('#cursor');
  if (!cursor) return;

  let cx = 0, cy = 0, tx = 0, ty = 0;
  document.addEventListener('mousemove', (e) => {
    tx = e.clientX; ty = e.clientY;
    cursor.classList.add('is-active');
  });
  document.addEventListener('mouseleave', () => cursor.classList.remove('is-active'));

  (function loop() {
    cx = lerp(cx, tx, 0.18);
    cy = lerp(cy, ty, 0.18);
    cursor.style.transform = `translate(${cx}px, ${cy}px)`;
    requestAnimationFrame(loop);
  })();

  const hoverTargets = 'a, button, .game-chip, .theme-card, .theme-option, .char-card, .trailer-card, .play-card, .stat, .gallery-item';
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(hoverTargets)) cursor.classList.add('is-hover');
  });
  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(hoverTargets)) cursor.classList.remove('is-hover');
  });
}

/* ── TOAST ───────────────────────────────────────────────────── */
let toastTimer = null;
function showToast(msg) {
  dom.toast.textContent = msg;
  dom.toast.classList.add('is-visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => dom.toast.classList.remove('is-visible'), 2200);
}

/* ── LOADER ──────────────────────────────────────────────────── */
function runLoader() {
  return new Promise((resolve) => {
    const steps = [
      { pct: 15,  status: 'LOADING ATMOSPHERE…', hint: 'CALIBRATING PARTICLES' },
      { pct: 38,  status: 'BUILDING WORLD…',      hint: 'RENDERING GEOMETRY' },
      { pct: 62,  status: 'COMPILING SHADERS…',   hint: 'OPTIMIZING PIPELINE' },
      { pct: 84,  status: 'ALIGNING STARS…',      hint: 'SYNCHRONIZING THEMES' },
      { pct: 100, status: 'ENTER THE WORLD',       hint: 'READY' }
    ];
    let i = 0;
    const tick = () => {
      if (i >= steps.length) {
        setTimeout(() => { dom.loader.classList.add('is-done'); resolve(); }, 500);
        return;
      }
      const s = steps[i++];
      dom.loaderBar.style.width = s.pct + '%';
      dom.loaderPct.textContent = s.pct + '%';
      dom.loaderStatus.textContent = s.status;
      dom.loaderHint.textContent = s.hint;
      setTimeout(tick, 400 + Math.random() * 250);
    };
    tick();
  });
}

/* ── INIT ────────────────────────────────────────────────────── */
async function init() {
  dom.year.textContent = new Date().getFullYear();
  if (window.lucide) window.lucide.createIcons();

  let savedTheme = null, savedGame = null;
  try {
    savedTheme = localStorage.getItem('worlds-theme');
    savedGame = localStorage.getItem('worlds-game');
  } catch (e) {}

  const initialTheme = savedTheme && THEMES.find(t => t.id === savedTheme) ? savedTheme : 'samurai-night';
  const initialGame = savedGame && GAMES[savedGame] ? savedGame : 'ghost';

  initThree();
  applyTheme(initialTheme, { silent: true });
  selectGame(initialGame, { silent: true });

  renderGameSelector();
  renderDossier(GAMES[initialGame]);
  renderCharacters(GAMES[initialGame]);
  renderGameplay(GAMES[initialGame]);
  renderGallery(GAMES[initialGame]);
  renderThemeGrid();
  renderThemePanel();
  renderTrailers();

  if (window.lucide) window.lucide.createIcons();

  dom.burger.addEventListener('click', toggleMobileMenu);
  dom.mobileThemeBtn.addEventListener('click', () => { closeMobileMenu(); openThemePanel(); });
  dom.navThemeBtn.addEventListener('click', openThemePanel);
  dom.themeFab.addEventListener('click', () => {
    if (dom.themePanel.classList.contains('is-open')) closeThemePanel();
    else openThemePanel();
  });
  dom.themePanelClose.addEventListener('click', closeThemePanel);
  dom.themeReset.addEventListener('click', () => {
    applyTheme('samurai-night');
    renderThemeGrid();
    showToast('Theme reset to Samurai Night');
  });

  dom.modalClose.addEventListener('click', closeTrailer);
  const backdrop = dom.modal.querySelector('[data-close-modal]');
  if (backdrop) backdrop.addEventListener('click', closeTrailer);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { closeTrailer(); closeThemePanel(); closeMobileMenu(); }
  });

  dom.exploreBtn.addEventListener('click', () => {
    const target = $('#games');
    if (target) window.scrollTo({ top: target.offsetTop - 68, behavior: 'smooth' });
  });

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  initReveal();
  initSmoothScroll();
  initCursor();

  if (dom.aboutMotion) dom.aboutMotion.textContent = prefersReducedMotion ? 'Reduced' : 'Full';

  $$('.footer__link[data-game]').forEach(btn => {
    btn.addEventListener('click', () => {
      selectGame(btn.dataset.game);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });

  await runLoader();

  if (window.gsap && !prefersReducedMotion) {
    gsap.from('.hero__head > *', { opacity: 0, y: 30, duration: 1, stagger: 0.12, ease: 'power3.out', delay: 0.2 });
    gsap.from('.game-chip', { opacity: 0, y: 20, duration: 0.8, stagger: 0.1, ease: 'power3.out', delay: 0.6 });
  }

  if (window.gsap && window.ScrollTrigger && !prefersReducedMotion) {
    gsap.registerPlugin(ScrollTrigger);
    $$('.section__head').forEach(head => {
      gsap.from(head, {
        scrollTrigger: { trigger: head, start: 'top 85%' },
        opacity: 0, y: 40, duration: 0.9, ease: 'power3.out'
      });
    });
  }
}

/* ── BOOT ────────────────────────────────────────────────────── */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}