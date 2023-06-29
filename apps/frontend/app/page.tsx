import styles from "./page.module.css";
import Hello from "../components/hello";

export default function Home() {
    return (
        <main className={styles.main}>
            <div className={styles.description}>
                <Hello />
            </div>
        </main>
    );
}
