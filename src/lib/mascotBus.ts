// Tiny event bus so other parts of the site (the terminal, the exit effect) can make the
// robot react without importing it.

export type MascotEventType =
  | 'rm-refused'
  | 'sudo-denied'
  | 'wipe-start'
  | 'wipe-cancel'
  | 'wipe-done'
  | 'exit-confirm'
  | 'gotcha-done'
  | 'six-seven';

export const MASCOT_EVENT = 'mascot';

export const notifyMascot = (type: MascotEventType) => {
  window.dispatchEvent(new CustomEvent<MascotEventType>(MASCOT_EVENT, { detail: type }));
};
