document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('a[href]').forEach((link) => {
    let url;
    try { url = new URL(link.getAttribute('href'), window.location.href); } catch (_) { return; }
    if (!/^https?:$/.test(url.protocol)) return;
    if (url.hostname === window.location.hostname) return;
    link.target = '_blank';
    const rel = new Set((link.getAttribute('rel') || '').split(/\s+/).filter(Boolean));
    rel.add('noopener'); rel.add('noreferrer');
    link.setAttribute('rel', Array.from(rel).join(' '));
  });
});
