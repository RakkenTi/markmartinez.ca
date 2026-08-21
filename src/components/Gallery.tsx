import { createSignal, For, Show, onCleanup, onMount } from 'solid-js';

export interface Shot {
  src: string;
  alt: string;
  caption?: string;
}

export default function Gallery(props: {
  shots: Shot[];
  variant?: string;
  display?: string;
}) {
  const [open, setOpen] = createSignal<number | null>(null);
  let track: HTMLUListElement | undefined;

  const marquee = () => props.display === 'marquee';
  const [live, setLive] = createSignal(false);
  const [rotation, setRotation] = createSignal(0);

  // an item is at most 23rem plus its gap, and the widest the row can be is the
  // 84rem shell, so this is the fewest passes that still overfill it by one item
  const ITEM = 388;
  const copies = () =>
    Math.max(1, Math.ceil((1344 + ITEM) / (props.shots.length * ITEM)));

  // shot references, not wrappers, so rotating moves the existing nodes
  const slots = () => {
    const shots = props.shots;
    const total = shots.length * copies();
    const offset = rotation();
    return Array.from(
      { length: total },
      (_, i) => shots[(i + offset) % shots.length]
    );
  };

  const gridClass = () => {
    const base = `shots__grid shots__grid--${props.variant ?? 'app'}`;
    if (props.variant === 'app') {
      return `${base} shots__grid--masonry${props.shots.length > 5 ? ' shots__grid--dense' : ''}`;
    }
    return `${base} shots__grid--pair`;
  };

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

    if (!marquee() || !track) return;

    // each pass moves exactly one item, then the list rotates by one, so the
    // row never has to reach for content parked far off screen
    const advance = () => setRotation((r) => (r + 1) % props.shots.length);
    track.addEventListener('animationiteration', advance);
    onCleanup(() => track?.removeEventListener('animationiteration', advance));
    setLive(true);
  });

  return (
    <>
      <Show
        when={marquee()}
        fallback={
          <ul class={gridClass()}>
            <For each={props.shots}>
              {(shot, index) => (
                <li class="shot">
                  <button type="button" class="shot__thumb" onClick={() => setOpen(index())}>
                    <img src={shot.src} alt={shot.alt} loading={index() < 2 ? 'eager' : 'lazy'} />
                  </button>
                  <Show when={shot.caption}>
                    <p class="shot__caption">{shot.caption}</p>
                  </Show>
                </li>
              )}
            </For>
          </ul>
        }
      >
        <div
          class={live() ? 'marquee marquee--live' : 'marquee'}
          style={{
            '--marquee-duration': '9s',
            '--marquee-shift': `${-100 / slots().length}%`,
          }}
        >
          <ul class="marquee__track" ref={track}>
            <For each={slots()}>
              {(shot, position) => {
                const duplicate = () => position() >= props.shots.length;
                return (
                  <li
                    class="shot marquee__item"
                    data-dup={duplicate() ? 'true' : undefined}
                    aria-hidden={duplicate() ? 'true' : undefined}
                  >
                    <button
                      type="button"
                      class="shot__thumb"
                      tabindex={duplicate() ? -1 : undefined}
                      onClick={() => setOpen(props.shots.indexOf(shot))}
                    >
                      <img src={shot.src} alt={duplicate() ? '' : shot.alt} />
                    </button>
                    <Show when={shot.caption}>
                      <p class="shot__caption">{shot.caption}</p>
                    </Show>
                  </li>
                );
              }}
            </For>
          </ul>
        </div>
      </Show>

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
