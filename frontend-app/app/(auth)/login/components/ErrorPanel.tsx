import { Icons } from "../../../components/icons";

export function ErrorPanel({ message }: { message: string }) {
  return (
    <div className="fade-in flex items-start gap-2.5 px-3.5 py-3 rounded-lg mb-4 text-[13px] border border-[rgba(239,68,68,0.3)] bg-bg-error text-text-error">
      <Icons.AlertCircle size={16} style={{ flexShrink: 0, marginTop: 1 }} />
      <span>{message}</span>
    </div>
  );
}
