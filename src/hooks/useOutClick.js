import { useCallback, useEffect, useRef, useState } from "react";

const useOutClick = () => {
	const [visible, setVisible] = useState(false);
	const ref = useRef(null);
	const buttonRef = useRef(null);

	const handleMouseClick = useCallback(({ target }) => {
		!buttonRef.current?.contains(target) && !ref.current?.contains(target) && setVisible(false);
	}, []);

	useEffect(() => {
		document.addEventListener("click", handleMouseClick, true);

		return () =>
			document.removeEventListener("click", handleMouseClick, true);
	}, [handleMouseClick]);

	return {
		buttonRef,
		ref,
		setVisible,
		visible,
	};
}

export default useOutClick;
