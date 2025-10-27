"use client";

import s from "@/Components/Pages/NotFoundPage/NotFoundPage.module.scss";
import NotFoundPageList from "@/Components/Pages/NotFoundPage/NotFoundPageList/NotFoundPageList";
import Link from "next/link";

const NotFoundPage = () => {
  return (
    <main className={s.notFoundPage}>
      <h1 className={s.errorCode}>404</h1>
      <h2 className={s.title}>Page Not Found</h2>
      <p className={s.description}>
        {`It looks like the page you're searching for doesn’t exist or may have been moved.`}
      </p>

      <NotFoundPageList />

      <div className={s.buttons}>
        <Link href="/" className={s.returnHomeBtn}>
          Return to Home page
        </Link>

        <button
          type="button"
          className={s.backBtn}
          onClick={() => window.history.back()}
        >
          Go Back
        </button>
      </div>
    </main>
  );
};

export default NotFoundPage;
