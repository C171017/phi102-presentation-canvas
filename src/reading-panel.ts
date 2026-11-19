import { slides } from './slide-content';
import { slideReadings } from './slide-readings';
import './reading-panel.css';

export function createReadingPanel() {
  const panel = document.querySelector<HTMLElement>('#reading-panel')!;
  const article = document.createElement('article');
  article.className = 'reading-content';
  article.tabIndex = 0;
  article.setAttribute('aria-labelledby', 'reading-title');
  panel.append(article);

  // Keep the original boxes as invisible anchors for saved positions,
  // connections, and slide framing; the reading panel owns their visible text.
  for (const slide of slides) {
    const heading = document.getElementById(slide.members[0])!;
    heading.classList.add('canvas-page-heading');
    heading.setAttribute('aria-hidden', 'true');
  }

  let current = -1;
  function update(index: number) {
    const slide = slides[index];
    if (!slide || index === current) return;
    current = index;
    const reading = slideReadings[slide.members[0]];
    article.innerHTML = `
      <div class="reading-page">
        <header>
          <p class="reading-section">${reading.section}</p>
          <h1 id="reading-title">${slide.title}</h1>
          <p class="reading-description">${slide.description}</p>
        </header>
        ${reading.body}
      </div>`;
    article.scrollTop = 0;
  }

  update(0);
  return { update };
}
