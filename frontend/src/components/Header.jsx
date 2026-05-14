import { NavLink } from "react-router";
import { useAuth } from "../store/authStore";
import {
  navbarClass,
  navContainerClass,
  navBrandClass,
  navLinksClass,
  navLinkClass,
  navLinkActiveClass,
} from "../styles/common";

function Header() {
  const isAuthenticated = useAuth((state) => state.isAuthenticated);
  const user = useAuth((state) => state.currentUser);
  // console.log("user in header:", user);  

  // decide profile route based on role
  const getProfilePath = () => {
    if (!user) return "/";

    switch (user.role) {
      case "AUTHOR":
        return "/author-profile";
      case "ADMIN":
        return "/admin-profile";
      default:
        return "/user-profile";
    }
  };

  return (
    <nav className="bg-blue-200">
      <div className={navContainerClass}>

        {/* LOGO */}
        <NavLink to="/" className="text-black">
          BlogApp
        </NavLink>

        <ul className={navLinksClass}>

          {/* HOME */}
          <li>
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                isActive ? "text-blue-900": "text-black"
              }
            >
              Home
            </NavLink>
          </li>

          {/* NOT LOGGED IN */}
          {!isAuthenticated && (
            <>
              <li>
                <NavLink
                  to="/register"
                  className={({ isActive }) =>
                    isActive ? "text-blue-900": "text-black"
                  }
                >
                  Register
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/login"
                  className={({ isActive }) =>
                    isActive ? "text-blue-900": "text-black"
                  }
                >
                  Login
                </NavLink>
              </li>
            </>
          )}

          {/* LOGGED IN */}
          {isAuthenticated && (
            <li>
              <NavLink
                to={getProfilePath()}
                className={({ isActive }) =>
                  isActive ? "text-blue-900": "text-black"
                }
              >
                Profile
              </NavLink>
            </li>
          )}


        </ul>
      </div>
    </nav>
  );
}

export default Header;