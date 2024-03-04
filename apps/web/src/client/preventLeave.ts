const beforeUnload = (event: BeforeUnloadEvent) => {
  event.preventDefault();
  event.returnValue = "";
};

export const preventLeave = (shouldPrevent: boolean) => {
  if (shouldPrevent) {
    window.addEventListener("beforeunload", beforeUnload);
  } else {
    window.removeEventListener("beforeunload", beforeUnload);
  }
};
