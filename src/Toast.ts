import { css, keyframes } from "goober";

type IType = "success" | "info" | "error";

interface IColorDefinition {
  [key: string]: {
    color: string;
    backgroundColor: string;
  };
}

// TODO Move JSS in an external file
const fadein = keyframes`
  from { bottom: 0; opacity: 0; }
  to { bottom: 30px; opacity: 1; }
`;

const fadeout = keyframes`
  from { bottom: 30px; opacity: 1; }
  to { bottom: 0; opacity: 0; }
`;

const fadeInToast = css`
  animation: ${fadein} 0.5s ease-in-out;
`;

const fadeOutToast = css`
  animation: ${fadeout} 0.5s ease-in-out;
`;

const ToastContainer = css`
  position: relative;
`;

const ToastWrapper = css`
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0.5rem;
  right: 0.5rem;
`;

const Toast = css`
  font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
    "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif,
    "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  display: flex;
  align-items: center;
  padding: 1rem;
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
  margin-bottom: 1rem;
  color: rgb(107 114 128 / 1);
`;

const colorDefinition: IColorDefinition = {
  success: {
    color: "rgb(34 197 94 / 1)",
    backgroundColor: "rgb(220 252 231 / 1)",
  },
  info: {
    color: "rgb(59 130 246 / 1)",
    backgroundColor: "rgb(219 234 254 / 1)",
  },
  error: {
    color: "rgb(239 68 68 / 1)",
    backgroundColor: "rgb(254 226 226 / 1)",
  },
};

const toastIcon = (type: string) =>
  css({
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    width: "2rem",
    height: "2rem",
    borderRadius: "0.5rem",
    ...colorDefinition[type]
  });

const toastText = css`
  margin-left: 0.75rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  font-weight: 400;
`;

const toastCloseButton = css`
  border-radius: 0.5rem;
  border: none;
  width: 2rem;
  height: 2rem;
  display: inline-flex;
  margin-left: auto;
  margin-top: -0.375rem;
  margin-bottom: -0.375rem;
  -webkit-appearance: button;
  background-color: transparent;
  background-image: none;
  padding: 0.375rem;
  color: rgb(156 163 175 / 1);
  cursor: pointer;

  &:hover {
    color: rgb(17 24 39 / 1);
    background-color: rgb(243 244 246 / 1);
  }
`;

const useToast = (toastContainerId?: string) => {
  // Get the given container div or try to get the default one created by useToast()
  let toastContainer = document.getElementById(
    toastContainerId || "toastContainer"
  );

  // If div doesn't exist, create it and inject it on top of the body tag
  if (!toastContainer) {
    const toastContainerElement = document.createElement("div");
    toastContainerElement.id = "toastContainer";
    toastContainerElement.classList.add(ToastContainer);

    document.body.prepend(toastContainerElement);

    toastContainer = toastContainerElement;
  }

  let toastWrapper: HTMLElement;

  // Append the flex wrapper
  if (!document.getElementById("toastWrapper")) {
    toastWrapper = document.createElement("div");
    toastWrapper.id = "toastWrapper";
    toastWrapper.classList.add(ToastWrapper);

    toastContainer.append(toastWrapper);
  }

  // Create a new HTML Element representing the toast
  // If an icon is given, add a div to display it correctly
  const createToastElement = (
    text: string,
    type: IType,
    icon?: string,
    duration = 3000
  ) => {
    const toast = document.createElement("div");
    toast.classList.add(Toast, fadeInToast);
    toast.ariaRoleDescription = "alert";

    // Create a new div for the content to easily customize it and set it first in the toast div
    const textContent = document.createElement("div");
    textContent.classList.add(toastText);
    textContent.textContent = text;

    toast.prepend(textContent);

    // If the user gave an icon in the parameters
    if (icon) {
      // Create the div that will contain the icon
      const iconDiv = document.createElement("div");
      iconDiv.classList.add(toastIcon(type));

      // Prepend the icon that should look like "<i class="bi bi-archive"></i>"
      iconDiv.innerHTML = icon;
      toast.prepend(iconDiv);
    }

    // Add the close button
    // TODO Make it optional and move the logic in an appropriate function
    const closeButton = document.createElement("button");
    closeButton.type = "button";
    closeButton.ariaRoleDescription = "Close toast";
    closeButton.classList.add(toastCloseButton);
    toast.append(closeButton);

    // Should move that code in an export variable but for the moment that will do. :)
    closeButton.innerHTML = `<svg style="width: 1.25rem; height: 1.25rem;" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
        </svg>`;

    // Auto remove the toast after {duration} time
    const toastTimeout = setTimeout(() => {
      toast.classList.add(fadeOutToast);

      toast.addEventListener("animationend", () => {
        toast.remove();
      });
    }, duration);

    closeButton.addEventListener("click", () => {
      clearTimeout(toastTimeout);
      toast.remove();
    });

    return toast;
  };

  /**
   * Create a new toast based on the values given in the parameters
   * TODO: Allow user to inject their own HTML to customize the toast
   * @param text
   * @param type
   * @param icon
   * @param duration
   */
  const createToast = (
    text: string,
    type: IType,
    icon?: string,
    duration?: number
  ) => {
    toastWrapper.prepend(createToastElement(text, type, icon, duration));
  };

  return { createToast };
};

export default useToast;
