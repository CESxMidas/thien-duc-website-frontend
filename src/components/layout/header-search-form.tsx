import { Search } from "lucide-react";
import type { Dictionary } from "@/lib/i18n/get-dictionary";

type HeaderSearchFormProps = {
  action: string;
  labels: Dictionary["header"];
  inputId: string;
  className?: string;
};

export function HeaderSearchForm({
  action,
  labels,
  inputId,
  className = "",
}: HeaderSearchFormProps) {
  return (
    <form

      role="search"
      action={action}
      className={`search-field h-11 items-center overflow-hidden rounded-md border border-brand/30 bg-white transition-colors ${className}`}
    >
      <label htmlFor={inputId} className="sr-only">
        {labels.searchLabel}
      </label>
     
      <input
        id={inputId}
        name="q"
        type="search"
        placeholder={labels.searchPlaceholder}
        className="h-full min-w-0 flex-1 bg-transparent pl-3 text-sm text-ink placeholder:text-slate"
      />
      <button
        type="submit"
        aria-label={labels.searchSubmit}
        className="button-polish grid h-full w-11 shrink-0 place-items-center bg-brand text-white transition-colors hover:bg-brand-dark"
      >
        <Search className="size-4" aria-hidden="true" />
      </button>
    </form>
  );
}
