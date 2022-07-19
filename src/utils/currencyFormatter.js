const currencyFormatter = new Intl.NumberFormat('en-ZA', {
	currency: "zar",
	style: "currency",
	minimumFractionDigits: 0
})

export default currencyFormatter