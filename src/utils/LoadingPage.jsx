import { DotsLoader } from "../components/controls";

const LoadingPage = ({ className }) => (
	<div 
		className={`${className} flex h-full items-center justify-center left-0 top-0 w-full z-[250]`}
		style={{
			background: `rgba(0,0,0,0.8)`
		}}
	>
		<DotsLoader color="white" />
	</div>
)

LoadingPage.defaultProps = {
	className: "fixed min-h-[70vh]"
}

export default LoadingPage;