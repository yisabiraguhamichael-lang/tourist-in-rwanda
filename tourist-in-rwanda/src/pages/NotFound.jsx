import { Link } from "react-router-dom";
export default function NotFound() {
  return (
    <div className="p-10 text-center">
      <h1 className="text-5xl font-bold">404</h1>
      <p className="mt-4">Page not found</p>
      <Link to="/" className="text-primary underline mt-4 inline-block">Go home</Link>
    </div>
  );
}