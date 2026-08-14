import { useEffect } from 'react';

/**
 * CursorGlow — desktop-only magnetic cursor ring.
 * • Only active on pointer:fine (desktop/trackpad) devices.
 * • Uses a single rAF loop with CSS transform — no layout reads.
 * • Uses lerp for smooth lag effect without jank.
 */
export const CursorGlow = () => {
  useEffect(() => {
    // Skip on touch / coarse-pointer devices — no performance cost
    if (!window.matchMedia('(pointer: fine)').matches) return;

    const cursor = document.getElementById('cursor-glow');
    if (!cursor) return;

    let rafId;
    let mouseX = 0;
    let mouseY = 0;
    let curX = 0;
    let curY = 0;
    let isActive = true;

    const lerp = (a, b, t) => a + (b - a) * t;

    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const addHover = () => cursor.classList.add('hovered');
    const removeHover = () => cursor.classList.remove('hovered');

    // Use event delegation — one listener for all interactive elements
    const handleOver = (e) => {
      if (e.target.closest('a, button, [role="button"], input, textarea, select')) {
        addHover();
      } else {
        removeHover();
      }
    };

    const animate = () => {
      if (!isActive) return;
      curX = lerp(curX, mouseX, 0.14);
      curY = lerp(curY, mouseY, 0.14);
      // GPU-only: transform, no top/left
      cursor.style.transform = `translate(${Math.round(curX - 18)}px, ${Math.round(curY - 18)}px)`;
      rafId = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseover', handleOver, { passive: true });
    rafId = requestAnimationFrame(animate);

    // Pause when tab is hidden (PageVisibility API)
    const handleVisibility = () => {
      if (document.hidden) {
        isActive = false;
        cancelAnimationFrame(rafId);
      } else {
        isActive = true;
        rafId = requestAnimationFrame(animate);
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      isActive = false;
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseover', handleOver);
      document.removeEventListener('visibilitychange', handleVisibility);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return null;
};

export default CursorGlow;
