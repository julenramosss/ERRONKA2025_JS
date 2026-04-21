import { useEffect, useState } from "react";

const HERE_SCRIPTS = [
  "https://js.api.here.com/v3/3.1/mapsjs-core.js",
  "https://js.api.here.com/v3/3.1/mapsjs-core-legacy.js",
  "https://js.api.here.com/v3/3.1/mapsjs-service.js",
  "https://js.api.here.com/v3/3.1/mapsjs-service-legacy.js",
  "https://js.api.here.com/v3/3.1/mapsjs-ui.js",
  "https://js.api.here.com/v3/3.1/mapsjs-mapevents.js",
];

const HERE_CSS = "https://js.api.here.com/v3/3.1/mapsjs-ui.css";

function loadScript(src: string): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    const existing = document.querySelector(
      `script[src="${src}"]`
    ) as HTMLScriptElement | null;

    if (existing) {
      if (existing.dataset.loaded === "true") {
        resolve();
        return;
      }

      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", reject, { once: true });
      return;
    }

    const script = document.createElement("script");
    script.src = src;
    script.addEventListener(
      "load",
      () => {
        script.dataset.loaded = "true";
        resolve();
      },
      { once: true }
    );
    script.addEventListener("error", reject, { once: true });
    document.head.appendChild(script);
  });
}

export function useHereMaps() {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    if (!document.querySelector(`link[href="${HERE_CSS}"]`)) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = HERE_CSS;
      document.head.appendChild(link);
    }

    HERE_SCRIPTS.reduce(
      (chain, src) => chain.then(() => loadScript(src)),
      Promise.resolve()
    )
      .then(() => {
        if (isMounted) setLoaded(true);
      })
      .catch((err) => {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error(String(err)));
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return { loaded, error };
}
