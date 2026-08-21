import { createSignal, For, Show, onCleanup, onMount } from 'solid-js';

export interface Shot {
  src: string;
  alt: string;
  caption?: string;
  size?: 'sm' | 'lg' | 'full' | 'half';
}

export default function Gallery(props: { shots: Shot[] }) {
  const [open, setOpen] = createSignal<number | null>(null);
  const pairs = () => props.shots.some((shot) => shot.size === 'half');

  const close = () => setOpen(null);
  const step = (delta: number) => {
    const current = open();
    if (current === null) return;
    setOpen((current + delta + props.shots.length) % props.shots.length);
  };

  onMount(() => {
    const onKey = (event: KeyboardEvent) => {
      if (open() === null) return;
      if (event.key === 'Escape') close();
      if (event.key === 'ArrowRight') step(1);
      if (event.key === 'ArrowLeft') step(-1);
    };
    window.addEventListener('keydown', onKey);
    onCleanup(() => window.removeEventListener('keydown', onKey));
  });

  return (
    <>
      <ul class={`gallery${pairs() ? ' gallery--pairs' : ''}`}>
        <For each={props.shots}>
          {(shot, index) => (
            <li
              class={`gallery__item${shot.size === 'sm' ? ' gallery__item--sm' : ''}${shot.size === 'lg' ? ' gallery__item--lg' : ''}${shot.size === 'full' ? ' gallery__item--full' : ''}${shot.size === 'half' ? ' gallery__item--half' : ''}`}
            >
              <button type="button" class="gallery__thumb" onClick={() => setOpen(index())}>
                <img src={shot.src} alt={shot.alt} loading={index() === 0 ? 'eager' : 'lazy'} />
              </button>
              <Show when={shot.caption}>
                <p class="gallery__caption">{shot.caption}</p>
              </Show>
            </li>
          )}
        </For>
      </ul>

      <Show when={open() !== null}>
        <div class="lightbox" role="dialog" aria-modal="true" aria-label="Enlarged image">
          <button type="button" class="lightbox__close" onClick={close} autofocus>
            Close
          </button>
          <img src={props.shots[open()!].src} alt={props.shots[open()!].alt} />
          <p class="lightbox__caption">{props.shots[open()!].caption}</p>
          <div class="lightbox__nav">
            <button type="button" onClick={() => step(-1)}>
              Previous
            </button>
            <button type="button" onClick={() => step(1)}>
              Next
            </button>
          </div>
        </div>
      </Show>
    </>
  );
}
