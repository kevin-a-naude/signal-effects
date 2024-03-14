<!--
**💛 You can help the author become a full-time open-source maintainer by [sponsoring him on GitHub](https://github.com/sponsors/kevin-in-code).**

---

-->

# @in-code/signal-effects

[![npm version](https://badgen.net/npm/v/@in-code/signal-effects)](https://npm.im/@in-code/signal-effects) [![npm downloads](https://badgen.net/npm/dm/@in-code/signal-effects)](https://npm.im/@in-code/signal-effects)

This library is a simple but robust implementation reactive signals and effects. Signals and effect have become popular in web application frameworks because they allow a change in a value (signal) in one part of the application to implicitly trigger updates (effects) in dependent parts of the application. Most beneficially, signals do not need to understand the effects that depend upon them.

```ts
const length = signal(5.0);
const height = signal(2.5);

effect(() => {
  console.log(`area = ${length.value * height.value}`);
});
```

## Install

```bash
npm i @in-code/signal-effects
```

<!--
## Sponsors

[![sponsors](https://sponsors-images.kevin-in-code.dev/sponsors.svg)](https://github.com/sponsors/kevin-in-code)
-->

## License

MIT &copy; [kevin-in-code](https://github.com/sponsors/kevin-in-code)
