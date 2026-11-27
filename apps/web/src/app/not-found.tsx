import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";
import { LinkButton } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[100dvh] w-full max-w-[720px] flex-col justify-center px-5 py-16 sm:px-8">
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-brand">404</p>
      <h1 className="mt-4 text-4xl font-medium tracking-[-0.03em] sm:text-5xl">
        This route is not in the plan.
      </h1>
      <p className="mt-4 max-w-[42ch] text-muted">
        Check the URL or return to the operating system. The workflow lives on the home page.
      </p>
      <div className="mt-8">
        <LinkButton href="/">
          <ArrowLeft size={16} weight="bold" aria-hidden="true" />
          Back to the OS
        </LinkButton>
      </div>
    </main>
  );
}
