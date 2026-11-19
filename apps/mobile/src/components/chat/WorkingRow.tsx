import { Bubble } from './Bubble';
export { workingText } from './status-line';

/** The agent's reply as it streams in; the working label and Stop live in the status line. */
export function StreamingReply({
  name,
  text,
  onLink,
}: {
  name: string;
  text?: string;
  onLink: (url: string) => void;
}) {
  if (!text) return null;
  return <Bubble text={text} time="" sender={name} own={false} onLink={onLink} />;
}
