/* Add/Remove class to the navmenu element */
function myFunction() {
    var x = document.getElementById("navmenu");
    if (x.className === "nav-menu") {
        x.className += " responsive";
    } else {
        x.className = "nav-menu";
    }
}