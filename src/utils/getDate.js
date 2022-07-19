function getDate(_date) {
	const date = _date ? new Date(_date) : new Date();
	return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export default getDate