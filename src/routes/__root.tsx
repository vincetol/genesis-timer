import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import Header from "../components/header/header";
import Footer from "../components/footer/footer";
import styles from "./__root.module.css";

export const Route = createRootRoute({
  component: () => (
    <div className={styles.Container}>
      <Header />
      {/* <div className="p-2 flex gap-2">
        <Link to="/" className="[&.active]:font-bold">
          Home
        </Link>{" "}
      </div> */}
      <main className={styles.Content}>
        <Outlet />
      </main>
      <Footer />
    </div>
  ),
});
