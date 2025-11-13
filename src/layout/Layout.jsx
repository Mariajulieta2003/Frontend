import React from "react";
import styles from "./styles/Layout.css";

export default function Layout({ title, children, footer }) {
  return (
    <div className={styles.root}>
      <div className={styles.card}>
        {title ? <h2 className={styles.title}>{title}</h2> : null}
        {children}
        {footer ? <div className={styles.footer}>{footer}</div> : null}
      </div>
    </div>
  );
}
