export interface Link {
  label: string;
  href: string;
}

export interface Fact {
  label: string;
  value: string;
}

export const site = {
  name: 'Mark Martinez',
  email: 'dev@markmartinez.ca',

  description:
    'Building games, software, and various hobby projects.',

  hero: 'Working on commercial games, engine tooling, and fun software.',

  facts: [
    {
      label: 'Studying',
      value: 'Computer Science, Toronto Metropolitan University',
    },
    {
      label: 'Languages',
      value: 'C++, C, Go, Rust, Elixir, Java, Python, TypeScript, Luau, GDScript, Bash',
    },
    {
      label: 'Game development',
      value: 'Godot, Roblox, Steamworks, GodotSteam',
    },
    {
      label: 'Web and backend',
      value: 'Node, Express, SolidJS, Vite, Electron, Tailwind, MongoDB, SQL',
    },
    {
      label: 'Tooling',
      value: 'Docker, GitHub Actions, Git, Linux on Fedora and Ubuntu',
    },
  ] satisfies Fact[],

  nav: [
    { label: 'Work', href: '/#work' },
    { label: 'Contact', href: '/#contact' },
  ] satisfies Link[],
};
