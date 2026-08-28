export interface Link {
  label: string;
  href: string;
}

export interface Fact {
  label: string;
  value: string;
}

const email = 'dev@markmartinez.ca';

export const site = {
  name: 'Mark',
  email,

  description:
    'Working on commercial games, engine tooling, and open source software.',

  hero: 'Working on commercial games, engine tooling, and open source software.',

  facts: [
    {
      label: 'Studying',
      value: 'Computer Science, Toronto Metropolitan University',
    },
    {
      label: 'Languages',
      value: 'C++, C, Go, Rust, Java, TypeScript, Python, Lua, Elixir, Lisp, GDScript, Bash',
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
    {
      label: 'Focus',
      value: 'OSS & Game Deveopment',
    }
  ] satisfies Fact[],

  nav: [
    { label: 'Work', href: '/#work' },
    { label: 'Write-ups', href: '/#writeups' },
    { label: 'Contact', href: `mailto:${email}` },
  ] satisfies Link[],
};
