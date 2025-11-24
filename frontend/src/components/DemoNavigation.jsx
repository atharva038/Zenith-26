import {Link, useLocation} from "react-router-dom";

export default function DemoNavigation() {
  const location = useLocation();

  const routes = [
    {path: "/", label: "Intro"},
    {path: "/home", label: "Homepage"},
    {path: "/parallax-demo", label: "Parallax Demo"},
    {path: "/scroll-animations", label: "Scroll Animations"},
  ];

  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] bg-black/80 backdrop-blur-md rounded-full border border-emerald-500/30 px-4 py-2">
      <div className="flex gap-2">
        {routes.map((route) => (
          <Link
            key={route.path}
            to={route.path}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              location.pathname === route.path
                ? "bg-emerald-500 text-black"
                : "text-white hover:bg-white/10"
            }`}
          >
            {route.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
