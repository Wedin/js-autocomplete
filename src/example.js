(() => {
  var pattern = Trianglify({
    width: window.innerWidth,
    height: window.innerHeight,
    x_colors: [
    "#8e0152",
    "#c51b7d",
    "#de77ae",
    "#f1b6da",
    "#fde0ef",
    "#f7f7f7",
    "#e6f5d0",
    "#b8e186",
    "#7fbc41",
    "#4d9221",
    "#276419"
    ]
  });
  document.querySelector(".page-wrapper").appendChild(pattern.canvas());
})();
