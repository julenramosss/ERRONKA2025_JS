import { ChangePwdForm } from "./ChangePwdForm";

export function SecuritySettings({ isActive }: { isActive: boolean }) {
  if (!isActive) return null;

  return (
    <div>
      <div className="bg-bg-surface border border-border rounded-lg overflow-hidden">
        <div className="py-4 px-4 sm:py-5 sm:px-6 md:px-8 border-b border-border">
          <h3 className="text-lg font-medium text-text-primary">Segurtasuna</h3>
          <p className="text-sm text-text-secondary">
            Eguneratu zure pasahitza zure kontua seguru mantentzeko.
          </p>
        </div>
        <ChangePwdForm />
      </div>
    </div>
  );
}
