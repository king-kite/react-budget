const NotFound = () => (
    <div style={{
			display: "flex",
			justifyContent: "center",
			alignItems: "center",
			marginRight: "auto",
			marginLeft: "auto",
			minHeight: "70vh",
			minWidth: "70vw",
			height: "100%",
			width: "100%"
		}}>
		<p style={{fontSize: "2rem"}}>404</p>
		<div style={{
			display: "block",
			background: "black",
			marginRight: "10px",
			marginLeft: "10px",
			height: "80px",
			width: "2px"
		}} />
		<p style={{fontSize: "1rem"}}>Not Found</p>
	</div>
)

export default NotFound
