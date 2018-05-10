window.addEventListener("resize",init);
function init(){
	if (window.matchMedia('(max-width: 1200px)').matches) {
		/* The viewport is less than, or equal to,  */
		//type="mobileContent";
		window.location.href = 'mob/index.html';
	} else {
		/* The viewport is greater than */
		//type="standardContent";
		window.location.href = 'pc/index.html';
	}
}