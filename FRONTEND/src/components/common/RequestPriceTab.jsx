import { useRequestPriceModal } from "../../context/RequestPriceModalContext";

// Same floating tab, same "Get in Touch" modal, on every route — including
// the homepage, which used to render its own separate copy of this button
// tied to local popup state. One shared trigger via
// RequestPriceModalContext means there's no route where clicking this
// falls back to just scrolling to a contact section instead of actually
// opening the form.
export default function RequestPriceTab() {
  const { open } = useRequestPriceModal();

  return (
    <button
      type="button"
      onClick={open}
      className="fixed right-0 top-1/2 -translate-y-1/2 z-[9998] bg-[#1A4744] hover:bg-[#335754] text-white text-sm font-semibold shadow-xl rounded-l-sm px-2 py-4 flex items-center justify-center border border-[#1A4744]"
      style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
    >
      Request Price
    </button>
  );
}
