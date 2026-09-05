import styles from "./Chip.module.css";

type ChipProps = {
  active?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  /** Dark variant for use on dark surfaces. */
  dark?: boolean;
};

/** A small uppercase mono toggle used by the section filters. */
export function Chip({ active, onClick, children, dark }: ChipProps) {
  const cls = [
    styles.chip,
    active ? styles.active : "",
    dark ? styles.dark : "",
  ]
    .filter(Boolean)
    .join(" ");
  return (
    <button type="button" className={cls} aria-pressed={active} onClick={onClick}>
      {children}
    </button>
  );
}
