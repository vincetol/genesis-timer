import styles from "./footer.module.css";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

export default function Footer() {
  return (
    <>
      <footer className={styles.Footer}>
        <div>Source / License / donate</div>
        <div>socials</div>
        <div>copyright / license</div>
      </footer>
      {/* <TanStackRouterDevtools /> */}
    </>
  );
}
