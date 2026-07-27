import { Link } from "react-router";

function NotFoundPage() {
  return (
    <main className="container py-5 text-center">
      <p className="display-1 fw-bold mb-0">404</p>

      <h1 className="h2">Page not found</h1>

      <p className="text-secondary">The page you requested does not exist.</p>

      <Link className="btn btn-primary" to="/">
        Return Home
      </Link>
    </main>
  );
}

export default NotFoundPage;
