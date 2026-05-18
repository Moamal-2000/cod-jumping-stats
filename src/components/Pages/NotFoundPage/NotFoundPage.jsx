import Link from "next/link";
import { useRouter } from "next/navigation";
import s from "./NotFoundPage.module.scss";
import NotFoundPageList from "./NotFoundPageList/NotFoundPageList";

const NotFoundPage = () => {
  const router = useRouter();

  return (
    <main className={s.notFoundPage}>
      <h1 className={s.errorCode}>404</h1>
      <h2 className={s.title}>Page Not Found</h2>
      <p className={s.description}>
        It looks like the page you're searching for doesn’t exist or may have
        been moved.
      </p>

      <NotFoundPageList />

      <div className={s.buttons}>
        <Link href="/" className={s.returnHomeBtn}>
          Return to Home page
        </Link>

        <button
          type="button"
          className={s.backBtn}
          onClick={() => router.back()}
        >
          Go Back
        </button>
      </div>
    </main>
  );
};

export default NotFoundPage;
