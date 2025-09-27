import { onMounted, onUnmounted } from "vue";

export function useClickOutside(
  element: HTMLElement | null,
  callback: () => void
) {
  const handleClick = (event: MouseEvent) => {
    if (element && !element.contains(event.target as Node)) {
      callback();
    }
  };

  onMounted(() => {
    document.addEventListener("click", handleClick);
  });

  onUnmounted(() => {
    document.removeEventListener("click", handleClick);
  });
}

// Global click outside handler
export function onClickOutside(
  element: HTMLElement | null,
  callback: () => void
) {
  useClickOutside(element, callback);
}
