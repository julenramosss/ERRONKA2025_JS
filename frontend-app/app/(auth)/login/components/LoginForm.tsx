"use client";
import { Icons } from "../../../components/icons";
import { useLoginForm } from "../hooks/useLoginForm";
import { ErrorPanel } from "./ErrorPanel";
import { ForgotPasswordModal } from "./ForgotPasswordModal";

export function LoginForm() {
  const {
    isError,
    error,
    isPending,
    emailRef,
    passwordRef,
    onSubmitLogin,
    isForgotPasswordModalOpen,
    toggleForgotPasswordModal,
  } = useLoginForm();
  return (
    <div>
      <ForgotPasswordModal
        isOpen={isForgotPasswordModalOpen}
        onClose={toggleForgotPasswordModal}
      />
      <form
        method="POST"
        onSubmit={(e) => {
          e.preventDefault();
          onSubmitLogin();
        }}
        className="flex flex-col gap-4"
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
        <div>
          <span className="text-text-secondary">Password</span>
          <div
            className={`bg-bg-surface flex items-center justify-between mt-3 px-4 py-1 rounded-md border border-gray-700 focus-within:border-accent focus-within:ring-1 focus-within:ring-accent transition-colors ${isError ? "border-red-500" : ""}`}
          >
            <Icons.Lock size={20} className="text-text-secondary" />
            <input
              ref={passwordRef}
              type="password"
              name="password"
              autoComplete="off"
              maxLength={50}
              className="w-full bg-transparent px-3 py-2 focus:outline-none text-white"
              placeholder="Zure pasahitza"
            />
          </div>
        </div>
        {isError && error && <ErrorPanel message={error.message} />}
        <div className="flex flex-col items-end justify-center gap-5">
          <button
            type="button"
            className="text-xs md:text-base text-accent-light font-semibold cursor-pointer"
            onClick={() => toggleForgotPasswordModal()}
          >
            Zure pasahitza ahaztu duzu?
          </button>
          <button
            type="submit"
            className="w-full flex items-center justify-center bg-accent text-white text-lg rounded-lg py-3 font-semibold gap-2 cursor-pointer hover:bg-accent-hover transition-colors shadow-[0_4px_24px_rgba(124,58,237,0.55)]"
          >
            {isPending ? "Saioa hasten..." : "Saioa hasi"}
            <Icons.ArrowRight size={16} className="inline ml-2" />
          </button>
        </div>
        <p className="text-xs md:text-base text-center text-text-secondary">
          Problemak sartzeko?{" "}
          <span className="text-accent-light font-semibold">
            Gurekin kontaktuan jarri zaitez!
          </span>
        </p>
      </form>
    </div>
  );
}
