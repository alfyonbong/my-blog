import { initTheme } from './theme.js';
import { escapeHtml, parseFrontMatter, renderMarkdown } from './markdown.js';

const content = document.getElementById('content');
const SITE_TITLE = 'my-blog';

let postsPromise = null;

function loadPosts() {
  if (!postsPromise) {
    postsPromise = fetch('posts/index.json').then((res) => {
      if (!res.ok) throw new Error('글 목록을 불러오지 못했습니다.');
      return res.json();
    });
  }
  return postsPromise;
}

function formatDate(date) {
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return escapeHtml(String(date || ''));
  return d.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });
}

function tagsHtml(tags) {
  if (!Array.isArray(tags) || !tags.length) return '';
  return `<span class="tags">${tags.map((t) => `<span class="tag">${escapeHtml(t)}</span>`).join('')}</span>`;
}

function show(html, title) {
  content.innerHTML = html;
  document.title = title ? `${title} · ${SITE_TITLE}` : SITE_TITLE;
  window.scrollTo(0, 0);
  content.focus({ preventScroll: true });
}

function showNotice(message) {
  show(`<p class="notice">${escapeHtml(message)}</p><p class="notice"><a href="#/">목록으로 돌아가기</a></p>`);
}

async function renderList() {
  const posts = await loadPosts();
  const sorted = [...posts].sort((a, b) => String(b.date).localeCompare(String(a.date)));
  const items = sorted.map((p) => `
    <li class="post-item">
      <h2><a href="#/post/${encodeURIComponent(p.slug)}">${escapeHtml(p.title)}</a></h2>
      <div class="post-meta">${formatDate(p.date)}${tagsHtml(p.tags)}</div>
      ${p.summary ? `<p class="post-summary">${escapeHtml(p.summary)}</p>` : ''}
    </li>`).join('');
  show(`<h1 class="page-title">글 목록</h1><ul class="post-list">${items}</ul>`);
}

async function renderPost(slug) {
  const posts = await loadPosts();
  const entry = posts.find((p) => p.slug === slug);
  if (!entry) return showNotice('글을 찾을 수 없습니다.');

  const res = await fetch(`posts/${encodeURIComponent(entry.slug)}.md`);
  if (!res.ok) return showNotice('글을 불러오지 못했습니다.');

  const { meta, body } = parseFrontMatter(await res.text());
  const title = meta.title || entry.title;
  const date = meta.date || entry.date;
  const tags = meta.tags || entry.tags;

  show(`
    <a class="back-link" href="#/">&larr; 목록</a>
    <article>
      <header class="article-header">
        <h1>${escapeHtml(title)}</h1>
        <div class="post-meta">${formatDate(date)}${tagsHtml(tags)}</div>
      </header>
      <div class="prose">${renderMarkdown(body)}</div>
    </article>`, title);
}

async function route() {
  const hash = location.hash.replace(/^#/, '') || '/';
  try {
    const postMatch = hash.match(/^\/post\/(.+)$/);
    if (postMatch) await renderPost(decodeURIComponent(postMatch[1]));
    else await renderList();
  } catch (err) {
    showNotice(err.message);
  }
}

initTheme();
document.getElementById('year').textContent = new Date().getFullYear();
window.addEventListener('hashchange', route);
route();
