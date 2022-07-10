import { Outlet } from "react-router-dom";
import { LoadingContextProvider } from "../contexts"

import Container from "./Container";

import "../styles/scrollbar.css";

const Layout = () => (
	<LoadingContextProvider>
		<Container>
			<Outlet />
		</Container>
	</LoadingContextProvider>
)

export default Layout