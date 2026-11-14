type ModalGroupOptions = {
  /** CSS selector matching the native dialogs in this group. */
  dialogSelector: string;
  /** CSS selector matching the buttons that open a dialog. */
  triggerSelector: string;
  /** Resolves the target dialog ID from a trigger button. */
  getDialogId: (trigger: HTMLButtonElement) => string | undefined;
  /** Runs before a dialog is shown, e.g. to activate the matching tab. */
  onOpen?: (dialog: HTMLDialogElement) => void;
};

/**
 * Wires a group of native `<dialog>` elements to their trigger buttons.
 *
 * Supports one open dialog at a time, closing via the close button, backdrop
 * click and Escape, and hash deep links (for example `#produkt-<slug>`).
 */
export function initModalGroup({
  dialogSelector,
  triggerSelector,
  getDialogId,
  onOpen,
}: ModalGroupOptions): void {
  const dialogs = Array.from(document.querySelectorAll<HTMLDialogElement>(dialogSelector));

  const closeDialog = (dialog: HTMLDialogElement) => {
    if (dialog.open) dialog.close();
  };

  const openDialog = (dialog: HTMLDialogElement) => {
    dialogs.forEach((other) => {
      if (other !== dialog) closeDialog(other);
    });

    onOpen?.(dialog);

    if (!dialog.open) dialog.showModal();
  };

  const dialogFromHash = () => {
    const id = window.location.hash.slice(1);
    if (!id) return null;

    const element = document.getElementById(id);
    return element instanceof HTMLDialogElement && element.matches(dialogSelector) ? element : null;
  };

  const syncWithHash = () => {
    const target = dialogFromHash();
    if (target) {
      openDialog(target);
      return;
    }
    dialogs.forEach(closeDialog);
  };

  document.querySelectorAll<HTMLButtonElement>(triggerSelector).forEach((button) => {
    button.addEventListener('click', () => {
      const dialogId = getDialogId(button);
      const dialog = dialogId ? document.getElementById(dialogId) : null;
      if (!(dialog instanceof HTMLDialogElement)) return;

      openDialog(dialog);
      if (window.location.hash !== `#${dialog.id}`) {
        window.history.pushState(null, '', `#${dialog.id}`);
      }
    });
  });

  document.querySelectorAll<HTMLButtonElement>('[data-close-dialog]').forEach((button) => {
    button.addEventListener('click', () => {
      const dialog = button.closest('dialog');
      if (dialog instanceof HTMLDialogElement) closeDialog(dialog);
    });
  });

  dialogs.forEach((dialog) => {
    dialog.addEventListener('click', (event) => {
      if (event.target === dialog) closeDialog(dialog);
    });

    dialog.addEventListener('close', () => {
      if (window.location.hash === `#${dialog.id}`) {
        window.history.replaceState(
          null,
          '',
          `${window.location.pathname}${window.location.search}`
        );
      }
    });
  });

  window.addEventListener('hashchange', syncWithHash);
  syncWithHash();
}
