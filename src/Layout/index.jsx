import { Outlet } from "react-router-dom";
import Container from "./Container";

import "../styles/scrollbar.css";

const Layout = () => (
	<Container>
		<Outlet />
	</Container>
)

export default Layout