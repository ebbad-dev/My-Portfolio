export function scrollToSection(id: string, reduceMotion = false) {
  const element = document.getElementById(id);
  if (!element) return;

  element.scrollIntoView({
    behavior: reduceMotion ? "auto" : "smooth",
    block: "start",
  });
}
