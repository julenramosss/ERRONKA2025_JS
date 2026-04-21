import { Icons } from "../../../components/icons";
import { useForgotPasswordModal } from "../hooks/useForgotPasswordModal";

export function ForgotPasswordModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { emailRef, showToast, isPending, isError, onClickForgotPassword } =
    useForgotPasswordModal(onClose);

  return (
    <div
      className={`z-200 absolute inset-0 bg-black/70 shadow-[0_0_70px_100px_rgba(0,0,0,0.5)] flex items-center justify-center md:p-4 transition-opacity duration-300 ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
    >
      <div
        className={`relative bg-bg-dark rounded-lg p-6 w-full max-w-md border ${isError ? "border-red-500" : "border-border"} transition-all duration-300 ${isOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-40"}`}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-accent-light">
            Pasahitza ahaztu duzu?
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
          >
            <Icons.X size={20} />
          </button>
        </div>
        <p className="text-text-secondary mb-6 text-balance">
          Ez kezkatu! Pasahitza berrezartzeko esteka bat bidaliko dizugu zure
          posta elektronikora.
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onClickForgotPassword();
          }}
          className="flex flex-col gap-10"
        >
          <div>
            <span className="text-text-secondary">Email</span>
            <div
              className={`bg-bg-surface flex items-center justify-between mt-3 px-4 py-1 rounded-md border border-gray-700 focus-within:border-accent focus-within:ring-1 focus-within:ring-accent transition-colors ${isError ? "border-red-500" : ""}`}
            >
              <Icons.Mail size={20} className="text-text-secondary" />
              <input
                ref={emailRef}
                type="email"
                name="email"
                maxLength={50}
                autoComplete="off"
                className="w-full bg-transparent px-3 py-2 focus:outline-none text-white"
                placeholder="username@tolosaerronka.es"
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full flex items-center justify-center bg-accent text-white text-lg rounded-lg py-3 font-semibold gap-2 cursor-pointer hover:bg-accent-hover transition-colors shadow-[0_4px_24px_rgba(124,58,237,0.55)]"
          >
            {isPending ? "Berritu pasahiza..." : "Berritu pasahiza"}
            <Icons.ArrowRight size={16} className="inline ml-2" />
          </button>
        </form>
      </div>
      {showToast && (
        <div
          className="absolute -bottom-5 left-1/2 -translate-x-1/2 w-full max-w-sm px-4"
          style={{ animation: "fadeInOut 4s ease forwards" }}
        >
          <span className="text-st-delivered bg-bg-delivered border border-st-delivered block p-3 rounded-md text-sm text-center">
            Pasahitza berrezartzeko esteka bidali da korreo elektronikora!
          </span>
        </div>
      )}
    </div>
  );
}
