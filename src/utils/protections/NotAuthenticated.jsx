import { useEffect, useState } from "react";
import { useSelector } from "react-redux"
import {
	Navigate,
	Outlet,
	useLocation,
	useSearchParams,
} from "react-router-dom";
import * as routes from "../../config/routes";

const NotAuthenticated = () => {
	const [nextRoute, setNextRoute] = useState(routes.HOME_PAGE_URL);
	
	const isAuthenticated = useSelector((state) => state.auth.isAuthenticated)
	const isLoading = useSelector((state) => state.auth.isLoading);

	const { state } = useLocation();
	const [searchParams] = useSearchParams();

  useEffect(() => {
    const unsafeCheckRoute = (url, routes) => {
      let route = "/" + url.split('/')[1] + "/";
      if (routes.includes(route)) return url;
      return null
    }

    const checkRoute = () => {
      const arrayRoutes = Object.values(routes);
      const filteredRoutes = arrayRoutes.map((route) => {
        if (typeof route === "function") return route("slug");
        else return route;
      });
  
      let _nextRoute = nextRoute;
      const searchNext = searchParams.get("next");
      if (searchNext !== null && typeof searchNext === "string")
      	_nextRoute = searchNext;
      else if (state?.next !== undefined && typeof state.next === "string")
        _nextRoute = state.next;        
      if (_nextRoute.slice(-1) !== "/" && _nextRoute !== "/")
        _nextRoute += "/";
      if (_nextRoute !== "/" && _nextRoute[0] !== "/")
        _nextRoute = "/" + _nextRoute
      if (filteredRoutes.includes(_nextRoute)) setNextRoute(_nextRoute)
      else {
        const route = unsafeCheckRoute(_nextRoute, filteredRoutes)
        if (route !== null) setNextRoute(route)
        else setNextRoute(routes.HOME_PAGE_URL)
      }  
    }
    checkRoute()
  }, [state, searchParams])
  
	return isLoading === false && isAuthenticated === false ? (
		<Outlet />
	) : isLoading === false && isAuthenticated ? (
		<Navigate to={nextRoute} replace />
	) : (
		<></>
	);
};

export default NotAuthenticated;
