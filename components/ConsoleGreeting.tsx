'use client';

import { useEffect } from 'react';

export function ConsoleGreeting() {
  useEffect(() => {
    const styles = {
      banner: 'color: #FF5910; font-size: 14px; font-weight: bold; font-family: monospace;',
      text: 'color: #d1d1c6; font-size: 12px; font-family: monospace;',
      link: 'color: #73F5FF; font-size: 12px; font-family: monospace;',
    };

    console.log(
      `%c
 ████████╗███████╗ ██████╗
 ╚══██╔══╝██╔════╝██╔════╝
    ██║   ███████╗██║
    ██║   ╚════██║██║
    ██║   ███████║╚██████╗
    ╚═╝   ╚══════╝ ╚═════╝`,
      styles.banner
    );
    console.log('%cHey, you found the source code.', styles.text);
    console.log('%cWe build things like this for fun.', styles.text);
    console.log('%c→ thestarrconspiracy.com/careers', styles.link);
  }, []);

  return null;
}
