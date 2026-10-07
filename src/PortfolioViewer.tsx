import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, X } from 'lucide-react';
import { presentationUrl } from './content';

const embedUrl =
  'https://docs.google.com/presentation/d/1iFFBQPyygs-H0GvaRIWCflWeG6z2dox5zJ8zE1vx5Ps/embed?start=false&loop=false&delayms=5000';

export default function PortfolioViewer() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  function openPortfolio() {
    const dialog = dialogRef.current;
    if (!dialog || dialog.open) return;
    // Native showModal supplies focus containment and returns focus to this
    // trigger when the dialog closes, including with the Escape key.
    dialog.showModal();
    setIsOpen(true);
  }

  function closeFromBackdrop(event: React.MouseEvent<HTMLDialogElement>) {
    if (event.target !== event.currentTarget) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    if (
      event.clientX < bounds.left ||
      event.clientX > bounds.right ||
      event.clientY < bounds.top ||
      event.clientY > bounds.bottom
    ) {
      event.currentTarget.close();
    }
  }

  return (
    <>
      <button
        type="button"
        className="text-link portfolio-open"
        aria-haspopup="dialog"
        onClick={openPortfolio}
      >
        Explore Lydia’s portfolio <ArrowUpRight size={17} aria-hidden="true" />
      </button>
      <dialog
        ref={dialogRef}
        className="portfolio-dialog"
        aria-label="LydsEvents portfolio presentation"
        onClose={() => setIsOpen(false)}
        onClick={closeFromBackdrop}
      >
        <div className="portfolio-dialog-header">
          <h2>Lydia’s portfolio</h2>
          <button
            type="button"
            className="portfolio-dialog-close"
            aria-label="Close portfolio presentation"
            onClick={() => dialogRef.current?.close()}
            autoFocus
          >
            <X size={21} aria-hidden="true" />
          </button>
        </div>
        {isOpen && (
          <iframe
            className="portfolio-dialog-frame"
            src={embedUrl}
            title="Lydia’s wedding and event portfolio presentation"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
          />
        )}
        <div className="portfolio-dialog-footer">
          <a className="text-link" href={presentationUrl} target="_blank" rel="noreferrer">
            You can also open the presentation in a new tab.{' '}
            <ArrowUpRight size={15} aria-hidden="true" />
          </a>
        </div>
      </dialog>
    </>
  );
}
